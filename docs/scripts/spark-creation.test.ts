import { expect, test } from 'bun:test';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const docs = path.resolve(import.meta.dirname, '..');
const content = path.join(docs, 'content/spark');
const landing = 'src/components/site/framework-landing.tsx';
const read = (file: string) => readFileSync(path.join(docs, file), 'utf8');

test('every Spark registry creation command uses the untagged creator', () => {
    const files = readdirSync(content, { recursive: true, encoding: 'utf8' })
        .filter((file) => file.endsWith('.mdx')).map((file) => `content/spark/${file}`);
    let commands = 0;
    for (const file of [...files, landing, 'src/app/(site)/page.tsx']) {
        const pattern = /\b(npm create|bun create|pnpm(?: --config\.minimum-release-age=0)? create|yarn create|npx|bunx|pnpm dlx|yarn dlx)\s+(@legendapp\/(?:create-)?spark(?:@[^\s'"`\\]+)?)/g;
        for (const match of read(file).matchAll(pattern)) {
            commands++;
            const creator = match[1].endsWith('create') ? '@legendapp/spark' : '@legendapp/create-spark';
            expect({ file, package: match[2] }).toEqual({ file, package: creator });
        }
    }
    expect(commands).toBeGreaterThan(0);
});

test('Spark onboarding keeps package manager variants, examples, and landing next steps', () => {
    const gettingStarted = read('content/spark/getting-started.mdx');
    for (const manager of ['npm', 'bun', 'pnpm', 'yarn']) {
        expect(gettingStarted).toContain(`${manager} create @legendapp/spark MyApp`);
    }
    expect(gettingStarted).toContain('Yarn Classic');
    expect(gettingStarted).toContain('Yarn PnP');
    expect(gettingStarted).toContain('npm create @legendapp/spark MyApp -- --package-manager pnpm');
    expect(gettingStarted).toContain('npm create @legendapp/spark MyApp -- --next');
    expect(gettingStarted).toContain('--latest');
    expect(gettingStarted).toContain('--spark-version <version|tag>');
    expect(gettingStarted).toContain('pnpm --config.minimum-release-age=0 create @legendapp/spark MyApp');
    const examples = read('content/spark/examples.mdx');
    for (const [app, example] of [['MyNotes', 'notes-lite'], ['MyMusic', 'music-lite'], ['MyDiff', 'diff-lite'], ['MyEditor', 'document-editor']]) {
        expect(examples).toContain(`npm create @legendapp/spark ${app} -- --example ${example}`);
    }
    expect(read(landing)).toContain('npm create @legendapp/spark MyApp\\ncd MyApp\\nnpm run macos');
});
