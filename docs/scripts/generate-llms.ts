#!/usr/bin/env bun

import fs from 'fs/promises';
import path from 'path';
import { globSync } from 'glob';

const PACKAGES = ['list', 'motion', 'state'] as const;
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const PUBLIC_DIR = path.join(ROOT, 'public');
const BASE_URL = process.env.LLMS_BASE_URL ?? 'https://www.legendapp.com/open-source';

function joinUrl(base: string, ...parts: string[]): string {
    const trimmedBase = base.replace(/\/+$/, '');
    const cleanedParts = parts.map((part) => part.replace(/^\/+|\/+$/g, ''));
    return [trimmedBase, ...cleanedParts].join('/');
}

function stripFrontmatter(content: string): string {
    const frontmatter = /^---[\s\S]*?---\s*/;
    return frontmatter.test(content) ? content.replace(frontmatter, '') : content;
}

function stripImportsExports(content: string): string {
    return content.replace(/^[ \t]*(import|export)[^\n]*\n?/gm, '');
}

function cleanContent(raw: string): string {
    const withoutFrontmatter = stripFrontmatter(raw);
    const withoutImports = withoutFrontmatter;
    return `${withoutImports.trim()}\n`;
}

async function writeFileEnsured(filePath: string, content: string) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf8');
}

async function main() {
    // Clean legacy global/package outputs from previous runs
    await fs.rm(path.join(PUBLIC_DIR, 'llms'), { recursive: true, force: true });
    await fs.rm(path.join(PUBLIC_DIR, 'llms.txt'), { force: true });
    await fs.rm(path.join(PUBLIC_DIR, 'llms-full.txt'), { force: true });

    let totalCount = 0;
    for (const pkg of PACKAGES) {
        const pkgContentDir = path.join(CONTENT_DIR, pkg);
        // Remove legacy package-level outputs
        await fs.rm(path.join(PUBLIC_DIR, pkg, 'llms'), { recursive: true, force: true });
        await fs.rm(path.join(PUBLIC_DIR, pkg, 'llms.txt'), { force: true });
        await fs.rm(path.join(PUBLIC_DIR, pkg, 'llms-full.txt'), { force: true });

        const versionEntries = await fs.readdir(pkgContentDir, { withFileTypes: true });
        const versions = versionEntries
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name)
            .sort();

        for (const version of versions) {
            const versionContentDir = path.join(pkgContentDir, version);
            const versionOutputDir = path.join(PUBLIC_DIR, pkg, version, 'llms');

            await fs.rm(versionOutputDir, { recursive: true, force: true });

            const entries = globSync('**/*.mdx', { cwd: versionContentDir, nodir: true }).sort();
            const versionLinks: string[] = [];
            const versionFullChunks: string[] = [];

            for (const entry of entries) {
                const absolutePath = path.join(versionContentDir, entry);
                const raw = await fs.readFile(absolutePath, 'utf8');
                const cleaned = cleanContent(raw);

                const slug = entry.replace(/\.mdx$/, '');
                const outputPath = path.join(versionOutputDir, `${slug}.md`);
                await writeFileEnsured(outputPath, cleaned);

                const url = joinUrl(BASE_URL, pkg, version, 'llms', `${slug}.md`);
                versionLinks.push(url);

                versionFullChunks.push(`## ${slug}\n\n${cleaned}\n`);
                totalCount += 1;
            }

            versionLinks.sort();
            const llmsStr = versionLinks.join('\n') + '\n';
            const llmsFullStr = versionFullChunks.join('\n');
            await writeFileEnsured(path.join(PUBLIC_DIR, pkg, version, 'llms.txt'), llmsStr);
            await writeFileEnsured(path.join(PUBLIC_DIR, pkg, version, 'llms-full.txt'), llmsFullStr);
            await writeFileEnsured(path.join(PUBLIC_DIR, pkg, version, 'llms.md'), llmsStr);
            await writeFileEnsured(path.join(PUBLIC_DIR, pkg, version, 'llms-full.md'), llmsFullStr);
        }
    }

    console.log(`Generated ${totalCount} llms entries across ${PACKAGES.length} packages (per-version only)`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
