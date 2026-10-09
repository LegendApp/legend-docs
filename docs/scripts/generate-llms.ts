#!/usr/bin/env bun

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';
import { convertPage } from './markdown-export';
import { ROOT, documentationProjects as packages, documentationRoutes } from './documentation-routes';
import { getDocumentationRedirect } from '../src/lib/getDocsPath';
import { canonicalPath } from '../src/lib/documentation';

export const OUTPUT = path.join(ROOT, 'dist');
export const BASE_URL = process.env.LLMS_BASE_URL ?? 'https://legend.so';

export type ExportedPage = {
    project: string;
    version: string;
    title: string;
    description: string;
    url: string;
    htmlUrl: string;
    markdownUrl: string;
    legacyUrl: string;
};

export async function readRenderedPage(route: string) {
    let url = new URL(canonicalPath(getDocumentationRedirect(`/${route}`) ?? `/${route}/`), BASE_URL).href;
    for (let redirects = 0; redirects < 5; redirects++) {
        const html = await fs.readFile(path.join(OUTPUT, new URL(url).pathname, 'index.html'), 'utf8');
        const $ = load(html);
        const refresh = $('meta[http-equiv="refresh"]').attr('content');
        if (!refresh) return { html, url };
        const target = refresh.match(/url=(.+)$/i)?.[1];
        if (!target || new URL(target, url).origin !== new URL(BASE_URL).origin) throw new Error(`${url}: invalid documentation redirect`);
        url = new URL(target, url).href;
    }
    throw new Error(`${route}: documentation redirect loop`);
}

async function write(relative: string, content: string) {
    const destination = path.join(OUTPUT, relative);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, content);
}

export async function generate() {
    const pages: ExportedPage[] = [];
    for (const { project, route, version, legacy } of documentationRoutes()) {
        const { html, url } = await readRenderedPage(route);
        const page = convertPage(html, url);
        const markdownUrl = new URL(`/${route}.md`, BASE_URL).href;
        await write(`${route}.md`, page.markdown);
        await write(`${route}/index.md`, page.markdown);
        await write(legacy, page.markdown);
        pages.push({ project: project.slug, version, title: page.title, description: page.description, url,
            htmlUrl: new URL(`/${route}/`, BASE_URL).href, markdownUrl,
            legacyUrl: new URL(`/${legacy}`, BASE_URL).href });
    }

    const rootIndex = ['# Legend documentation', '', '> Apps, open-source libraries, and Legend Spark.', '',
        '## Version guidance', '',
        'Current means the current documentation version, not necessarily the stable npm release. Select archived documentation when targeting an older API.', '',
        ...packages.filter((project) => project.currentDocs).map((project) => `- [${project.name} current documentation](${new URL(project.currentDocs!, BASE_URL).href})`), ''];
    for (const project of packages) {
        const projectPages = pages.filter((page) => page.project === project.slug);
        const currentVersion = project.currentDocs?.split('/')[2];
        const versions = [...new Set(projectPages.map((page) => page.version))].sort((a, b) => a === currentVersion ? -1 : b === currentVersion ? 1 : b.localeCompare(a));
        const projectIndex = [`# ${project.name}`, '', `> ${project.description}`, ''];
        rootIndex.push(`## ${project.name}`, '', project.description, '',
            `- [Documentation index](${new URL(`/${project.slug}/llms.txt`, BASE_URL).href})`, '');
        if (project.status) rootIndex.push(`Status: ${project.status}.`, '');
        const availability = projectPages.find((page) => /\/(availability|limitations)\.md$/.test(page.markdownUrl));
        if (availability) rootIndex.push(`- [Availability and release status](${availability.markdownUrl})`, '');
        for (const version of versions) {
            const versionPages = projectPages.filter((page) => page.version === version);
            const label = version ? `${version} — ${version === currentVersion ? 'current documentation' : 'archived documentation'}` : 'current documentation';
            const prefix = [project.slug, version].filter(Boolean).join('/');
            const index = [`# ${project.name}${version ? ` ${version}` : ''}`, '', `> ${project.description}`, '', `Documentation: ${label}.`, ''];
            if (project.status) index.push(`Status: ${project.status}.`, '');
            index.push('## Pages', '', ...versionPages.map((page) => `- [${page.title}](${page.markdownUrl})${page.description ? `: ${page.description}` : ''}`), '');
            const full = (await Promise.all(versionPages.map(async (page) => fs.readFile(path.join(OUTPUT, new URL(page.markdownUrl).pathname), 'utf8')))).join('\n\n---\n\n');
            await write(`${prefix}/llms.txt`, index.join('\n'));
            await write(`${prefix}/llms.md`, index.join('\n'));
            await write(`${prefix}/llms-full.txt`, full);
            await write(`${prefix}/llms-full.md`, full);
            rootIndex.push(`- [${label}](${new URL(`/${prefix}/llms.txt`, BASE_URL).href})`, '');
            projectIndex.push(`- [${label}](${new URL(`/${prefix}/llms.txt`, BASE_URL).href})`, '');
        }
        if (project.category === 'library') await write(`${project.slug}/llms.txt`, projectIndex.join('\n'));
    }
    await write('llms.txt', rootIndex.join('\n'));
    await write('documentation-manifest.json', JSON.stringify(pages, null, 2) + '\n');
    console.log(`Generated faithful Markdown for ${pages.length} pages across ${packages.length} projects.`);
    return pages;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await generate();
