import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LIST_EXAMPLE_DOCS } from '../src/components/list/docs/exampleDocsData';

const [checkout, ref = 'HEAD'] = process.argv.slice(2);
if (!checkout) {
    throw new Error('Usage: bun scripts/sync-list-example-sources.ts <legend-list-checkout> [commit-or-tag]');
}

const git = (...args: string[]) => execFileSync('git', ['-C', path.resolve(checkout), ...args], { encoding: 'utf8' });
const revision = git('rev-parse', '--verify', `${ref}^{commit}`).trim();
// Read committed files, never local edits. Resolve every file before writing anything.
const files = LIST_EXAMPLE_DOCS.map(({ sourcePath }) => ({
    sourcePath,
    source: git('show', `${revision}:${sourcePath}`),
}));
const destination = fileURLToPath(new URL('../vendor/legend-list', import.meta.url));
for (const { sourcePath, source } of files) {
    const target = path.join(destination, `${sourcePath}.txt`);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, source);
}
await writeFile(
    path.join(destination, 'manifest.json'),
    JSON.stringify({ repository: 'https://github.com/LegendApp/legend-list', revision, files: files.map(({ sourcePath }) => sourcePath) }, null, 2) + '\n',
);
console.log(`Saved ${files.length} complete example sources from ${revision}`);
