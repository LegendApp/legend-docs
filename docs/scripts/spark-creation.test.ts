import { expect, test } from 'bun:test';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const docs = path.resolve(import.meta.dirname, '..');
const content = path.join(docs, 'content/spark');
const landing = 'src/components/site/framework-landing.tsx';
const read = (file: string) => readFileSync(path.join(docs, file), 'utf8');

test('every Spark registry creation command uses the next creator', () => {
    const files = readdirSync(content, { recursive: true, encoding: 'utf8' })
        .filter((file) => file.endsWith('.mdx')).map((file) => `content/spark/${file}`);
    let commands = 0;
    for (const file of [...files, landing]) {
        const pattern = /\b(npm create|bun create|pnpm create|yarn create|npx|bunx|pnpm dlx|yarn dlx)\s+(@legendapp\/(?:create-)?spark(?:@[^\s'"`\\]+)?)/g;
        for (const match of read(file).matchAll(pattern)) {
            commands++;
            const creator = match[1].endsWith('create') ? '@legendapp/spark@next' : '@legendapp/create-spark@next';
            expect({ file, package: match[2] }).toEqual({ file, package: creator });
        }
    }
    expect(commands).toBeGreaterThan(0);
});

test('Spark onboarding keeps package manager variants, examples, and landing next steps', () => {
    const gettingStarted = read('content/spark/getting-started.mdx');
    for (const manager of ['npm', 'bun', 'pnpm', 'yarn']) {
        expect(gettingStarted).toContain(`${manager} create @legendapp/spark@next MyApp`);
    }
    expect(gettingStarted).toContain('yarn create @legendapp/spark@next MyApp # Yarn 2+');
    expect(gettingStarted).toContain('For Yarn Classic (1.x)');
    expect(gettingStarted).toContain('npm create @legendapp/spark@next MyApp -- --package-manager yarn');
    const examples = read('content/spark/examples.mdx');
    for (const [app, example] of [['MyNotes', 'notes-lite'], ['MyMusic', 'music-lite'], ['MyDiff', 'diff-lite'], ['MyEditor', 'document-editor']]) {
        expect(examples).toContain(`npm create @legendapp/spark@next ${app} -- --example ${example}`);
    }
    expect(read(landing)).toContain('npm create @legendapp/spark@next MyApp\\ncd MyApp\\nnpm run macos');
});
