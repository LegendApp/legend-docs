import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = path.resolve(import.meta.dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'public/slides/effects/catalog.json'), 'utf8'));
function artifact(url: string, checksum?: string, bytes?: number) {
    if (!url.startsWith('/slides/effects/') || url.includes('..')) throw new Error(`Invalid artifact URL: ${url}`);
    const data = fs.readFileSync(path.join(root, 'public', url));
    if (checksum && createHash('sha256').update(data).digest('hex') !== checksum) throw new Error(`Checksum mismatch: ${url}`);
    if (bytes !== undefined && data.length !== bytes) throw new Error(`Size mismatch: ${url}`);
    return data;
}
if (catalog.schemaVersion !== 1) throw new Error('Unknown effect catalog version.');
for (const [id, pack] of Object.entries(catalog.packs) as [string, any][]) {
    if (!pack.versions[pack.latest]) throw new Error(`Missing latest release: ${id}`);
    for (const [version, release] of Object.entries(pack.versions) as [string, any][]) {
        const archive = JSON.parse(artifact(release.url, release.sha256, release.bytes).toString());
        const manifest = JSON.parse(archive.files['pack.json']);
        if (archive.schemaVersion !== 1 || manifest.id !== id || manifest.version !== version || manifest.hostApiVersion !== 1) throw new Error(`Invalid release: ${id}@${version}`);
        for (const file of Object.keys(archive.files)) if (file.startsWith('/') || file.split('/').includes('..')) throw new Error(`Unsafe source path: ${file}`);
        for (const [entry, file] of Object.entries(release.exports)) if (!archive.files[(file as string).replace(/^\.\//, '')] || manifest.exports[entry] !== file) throw new Error(`Invalid export: ${id}/${entry}`);
        for (const [dependency, required] of Object.entries(release.dependencies)) if (!catalog.packs[dependency]?.versions[required as string]) throw new Error(`Missing dependency: ${dependency}@${required}`);
    }
}
const slugs = new Set();
for (const effect of catalog.effects) {
    if (slugs.has(effect.slug)) throw new Error(`Duplicate effect: ${effect.slug}`);
    slugs.add(effect.slug);
    const pack = catalog.packs[effect.pack];
    if (!pack?.versions[pack.latest].exports[effect.entry]) throw new Error(`Unknown effect entry: ${effect.slug}`);
    if (artifact(effect.example.url, effect.example.sha256, effect.example.bytes).toString() !== effect.snippet) throw new Error(`Snippet mismatch: ${effect.slug}`);
    if (!fs.existsSync(path.join(root, 'content/slides/effects', effect.slug + '.mdx'))) throw new Error(`Missing effect page: ${effect.slug}`);
    if (effect.preview) {
        if (effect.preview.exampleSha256 !== effect.example.sha256 || effect.preview.packSha256 !== pack.versions[pack.latest].sha256) throw new Error(`Stale preview: ${effect.slug}`);
        artifact(effect.preview.poster); if (effect.preview.video) artifact(effect.preview.video);
    }
}
console.log(`Verified ${Object.keys(catalog.packs).length} packs and ${slugs.size} examples.`);
