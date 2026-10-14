import { expect, test } from 'bun:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

// Exercise the real refresh and verifier; only the external deck compiler/schema are stubbed.
test('refresh preserves prose and capture provenance while hosting the offline example sprite', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'slides-refresh-test-'));
    const docs = path.join(root, 'docs'), apps = path.join(root, 'apps');
    function write(file: string, data: string | Buffer) {
        fs.mkdirSync(path.dirname(file), {recursive: true});
        fs.writeFileSync(file, data);
    }
    const digest = (data: string | Buffer) => createHash('sha256').update(data).digest('hex');
    const output = path.join(docs, 'public/slides/effects');
    const catalogFile = path.join(output, 'catalog.json');
    const sources = path.join(apps, 'packages/slides-effects');
    const source = `---\ntitle: Sprite\n---\n\nexport const sprite = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==";\n`;
    const effect = {slug: 'sprite', title: 'Sprite', description: 'Updated description', pack: 'fixture', entry: 'Sprite', tags: [], props: [], snippet: source};
    function release(version: string) {
        const manifest = {id: 'fixture', version, hostApiVersion: 1, capabilities: [], exports: {Sprite: './Sprite.tsx'}};
        const archive = JSON.stringify({schemaVersion: 1, files: {'pack.json': JSON.stringify(manifest), 'Sprite.tsx': 'export const Sprite = () => null;'}}) + '\n';
        const sha256 = digest(archive), url = `/slides/effects/packs/fixture/${version}/${sha256}.json`;
        write(path.join(docs, 'public', url), archive);
        return {version, sha256, bytes: Buffer.byteLength(archive), url, hostApiVersion: 1, capabilities: [], dependencies: {}, exports: manifest.exports};
    }
    function run(script: string, args: string[] = []) {
        return spawnSync(process.execPath, [path.join(docs, 'scripts', script), ...args], {env: {...process.env, LEGEND_APPS_PATH: apps}, encoding: 'utf8'});
    }
    const readCatalog = () => JSON.parse(fs.readFileSync(catalogFile, 'utf8'));
    try {
        for (const script of ['refresh-slides-effects.ts', 'validate-slides-effects.ts', 'slides-effect-snippets.ts']) {
            write(path.join(docs, 'scripts', script), fs.readFileSync(path.join(import.meta.dirname, script)));
        }
        write(path.join(apps, 'packages/presentation/src/compiler/index.ts'), 'export async function compileDeck() { return {success: true, errors: []}; }');
        write(path.join(apps, 'packages/presentation/src/effectPacks/schema.ts'), 'export function validateCatalog() {}');
        const old = release('1.0.0'), latest = release('1.0.1');
        const preview = {poster: '/slides/effects/previews/sprite.png', renderer: 'Fixture', exampleSha256: digest(source), packSha256: old.sha256};
        write(path.join(output, 'previews/sprite.png'), 'fixture poster');
        write(catalogFile, JSON.stringify({schemaVersion: 1, packs: {fixture: {latest: latest.version, versions: {'1.0.0': old, '1.0.1': latest}}}, effects: [{...effect, preview}]}));
        write(path.join(sources, 'catalog.json'), JSON.stringify({effects: [effect]}));
        const exampleFile = path.join(sources, 'examples/sprite/example.mdx');
        write(exampleFile, source);
        const pageFile = path.join(docs, 'content/slides/effects/sprite.mdx');
        const prose = '\nimport { EffectDetail } from "@/components/slides/EffectsGallery";\n\nKeep this authored guidance.\n\n<EffectDetail slug="sprite" />\n';
        write(pageFile, `---\ntitle: Old title\ndescription: Old description\n---\n${prose}`);
        const refresh = run('refresh-slides-effects.ts', ['--examples-only']);
        expect(refresh.stderr).toBe('');
        expect(refresh.status).toBe(0);
        const refreshed = readCatalog().effects[0];
        expect(refreshed.preview).toEqual(preview);
        expect(refreshed.snippet).toContain('https://legend.so/slides/effects/sprites/');
        expect(refreshed.snippet).not.toContain('base64');
        expect(fs.readFileSync(path.join(docs, 'public', refreshed.example.url), 'utf8')).toBe(source);
        expect(fs.readFileSync(pageFile, 'utf8')).toBe(`---\ntitle: Sprite\ndescription: Updated description\n---\n${prose}`);
        expect(run('validate-slides-effects.ts').status).toBe(0);
        // A hosted source-catalog snippet is also accepted, without changing the offline example.
        write(path.join(sources, 'catalog.json'), JSON.stringify({effects: [{...effect, snippet: refreshed.snippet}]}));
        expect(run('refresh-slides-effects.ts', ['--examples-only']).status).toBe(0);
        expect(readCatalog().effects[0].preview).toEqual(preview);
        write(path.join(sources, 'catalog.json'), JSON.stringify({effects: [{...effect, snippet: source + 'mismatch'}]}));
        const mismatch = run('refresh-slides-effects.ts', ['--examples-only']);
        expect(mismatch.status).not.toBe(0);
        expect(mismatch.stderr).toContain('Example and snippet differ');
        expect(readCatalog().effects[0].preview).toEqual(preview);
        // A changed example invalidates its capture rather than relabeling it.
        const changed = source + '\nNew content.\n';
        write(exampleFile, changed);
        write(path.join(sources, 'catalog.json'), JSON.stringify({effects: [{...effect, snippet: changed}]}));
        expect(run('refresh-slides-effects.ts', ['--examples-only']).status).toBe(0);
        expect(readCatalog().effects[0].preview).toBeUndefined();
        expect(run('validate-slides-effects.ts').status).toBe(0);
        const spriteFile = path.join(output, 'sprites', fs.readdirSync(path.join(output, 'sprites'))[0]);
        fs.appendFileSync(spriteFile, 'corrupt');
        const invalid = run('validate-slides-effects.ts');
        expect(invalid.status).not.toBe(0);
        expect(invalid.stderr).toContain('Checksum mismatch');
        const corruptRefresh = run('refresh-slides-effects.ts', ['--examples-only']);
        expect(corruptRefresh.status).not.toBe(0);
        expect(corruptRefresh.stderr).toContain('Published artifact changed');
    } finally { fs.rmSync(root, {recursive: true, force: true}); }
});
