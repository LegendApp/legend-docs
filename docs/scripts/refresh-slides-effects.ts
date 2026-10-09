import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'public/slides/effects');
const apps = process.env.LEGEND_APPS_PATH ?? path.resolve(root, '../../legend-apps');
const sources = path.join(apps, 'packages/slides-effects');
const digest = (text: string) => createHash('sha256').update(text).digest('hex');
function immutable(file: string, contents: string) {
    if (fs.existsSync(file)) {
        if (fs.readFileSync(file, 'utf8') !== contents) throw new Error(`Published artifact changed: ${file}`);
        return;
    }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, contents);
}
function runtimeFiles(directory: string, prefix = ''): Record<string, string> {
    return Object.fromEntries(fs.readdirSync(directory, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name)).flatMap(entry => {
        const file = path.join(directory, entry.name), relative = prefix + entry.name;
        return entry.isDirectory() ? Object.entries(runtimeFiles(file, relative + '/')) : /\.(tsx?|json)$/.test(file) ? [[relative, fs.readFileSync(file, 'utf8')]] : [];
    }));
}
const { validateCatalog } = await import(pathToFileURL(path.join(apps, 'packages/presentation/src/effectPacks/schema.ts')).href);
const { compileDeck } = await import(pathToFileURL(path.join(apps, 'packages/presentation/src/compiler/index.ts')).href);
const catalogFile = path.join(output, 'catalog.json');
const catalog = fs.existsSync(catalogFile) ? JSON.parse(fs.readFileSync(catalogFile, 'utf8')) : { schemaVersion: 1, packs: {}, effects: [] };
if (!process.argv.includes('--examples-only')) for (const entry of fs.readdirSync(path.join(sources, 'packs')).sort()) {
    const directory = path.join(sources, 'packs', entry);
    if (!fs.existsSync(path.join(directory, 'pack.json'))) continue;
    const files = runtimeFiles(directory), manifest = JSON.parse(files['pack.json']);
    const archive = JSON.stringify({ schemaVersion: 1, files }) + '\n', sha256 = digest(archive);
    const url = `/slides/effects/packs/${manifest.id}/${manifest.version}/${sha256}.json`;
    const previous = catalog.packs[manifest.id]?.versions[manifest.version];
    if (previous && previous.sha256 !== sha256) throw new Error(`Bump ${manifest.id}'s pack version before changing published runtime source.`);
    immutable(path.join(root, 'public', url), archive);
    const release = { version: manifest.version, sha256, bytes: Buffer.byteLength(archive), url, hostApiVersion: manifest.hostApiVersion,
        capabilities: manifest.capabilities, dependencies: manifest.dependencies ?? {}, exports: manifest.exports };
    catalog.packs[manifest.id] = { latest: manifest.version, versions: { ...catalog.packs[manifest.id]?.versions, [manifest.version]: release } };
}
const metadata = JSON.parse(fs.readFileSync(path.join(sources, 'catalog.json'), 'utf8'));
const effects = [];
const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'slides-catalog-'));
try {
    for (const [id, pack] of Object.entries(catalog.packs) as [string, any][]) for (const release of Object.values(pack.versions) as any[]) {
        const text = fs.readFileSync(path.join(root, 'public', release.url), 'utf8');
        if (digest(text) !== release.sha256) throw new Error(`Corrupt release: ${id}@${release.version}`);
        const directory = path.join(stage, 'packs', id, release.version, release.sha256);
        for (const [file, source] of Object.entries(JSON.parse(text).files) as [string, string][]) {
            const target = path.join(directory, file);
            fs.mkdirSync(path.dirname(target), {recursive: true}); fs.writeFileSync(target, source);
        }
        fs.writeFileSync(path.join(directory, '.archive.json'), text);
    }
    for (const effect of metadata.effects) {
        const release = catalog.packs[effect.pack]?.versions[catalog.packs[effect.pack].latest];
        if (!release?.exports[effect.entry]) throw new Error(`Unexported catalog entry: ${effect.slug}`);
        const exampleFile = path.join(sources, 'examples', effect.slug, 'example.mdx');
        const source = fs.readFileSync(exampleFile, 'utf8');
        if (source !== effect.snippet) throw new Error(`Example and snippet differ: ${effect.slug}`);
        const pins: Record<string, {version: string; sha256: string}> = {};
        function pin(id: string, version: string) {
            if (pins[id]) { if (pins[id].version !== version) throw new Error(`Conflicting example dependency: ${id}`); return; }
            const release = catalog.packs[id].versions[version];
            pins[id] = {version, sha256: release.sha256};
            for (const [dependency, required] of Object.entries(release.dependencies)) pin(dependency, required as string);
        }
        pin(effect.pack, release.version);
        const stagedExample = path.join(stage, effect.slug, 'example.mdx');
        fs.mkdirSync(path.dirname(stagedExample), {recursive: true}); fs.writeFileSync(stagedExample, source);
        fs.writeFileSync(stagedExample + '.effects.lock.json', JSON.stringify({schemaVersion: 1, packs: pins}));
        const compiled = await compileDeck(stagedExample, {effectPacksDirectory: path.join(stage, 'packs')});
        if (!compiled.success) throw new Error(`${effect.slug}: ${compiled.errors.join('\n')}`);
        const sha256 = digest(source), url = `/slides/effects/examples/${effect.slug}/${sha256}.mdx`;
        immutable(path.join(root, 'public', url), source);
        const previous = catalog.effects.find((entry: {slug: string}) => entry.slug === effect.slug);
        effects.push({ ...effect, example: { url, sha256, bytes: Buffer.byteLength(source) }, ...(previous?.preview?.exampleSha256 === sha256 && previous.preview.packSha256 === release.sha256 ? {preview: previous.preview} : {}) });
        const page = `---\ntitle: ${effect.title}\ndescription: ${effect.description}\n---\n\nimport { EffectDetail } from '@/components/slides/EffectsGallery';\n\n<EffectDetail slug="${effect.slug}" />\n`;
        fs.mkdirSync(path.join(root, 'content/slides/effects'), {recursive: true});
        fs.writeFileSync(path.join(root, 'content/slides/effects', effect.slug + '.mdx'), page);
    }
} finally { fs.rmSync(stage, {recursive: true, force: true}); }
catalog.effects = effects;
validateCatalog(catalog);
fs.writeFileSync(catalogFile, JSON.stringify(catalog, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'content/slides/effects/meta.json'), JSON.stringify({title: 'Effects', pages: ['index', 'installation', 'publishing', ...effects.map(effect => effect.slug)]}, null, 2) + '\n');
console.log(`Published ${Object.keys(catalog.packs).length} pack snapshots and ${effects.length} compiled examples locally. No deployment performed.`);
