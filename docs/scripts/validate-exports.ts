import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';
import { documentationRoutes, generatedDocumentationPaths } from './documentation-routes';
import { BASE_URL, OUTPUT, readRenderedPage, type ExportedPage } from './generate-llms';
import { convertPage } from './markdown-export';
import { LIST_EXAMPLE_DOCS_BY_SLUG } from '../src/components/list/docs/exampleDocsData';
import catalog from '../public/slides/effects/catalog.json';

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message);
}

export async function validateExports() {
    const pages: ExportedPage[] = JSON.parse(await fs.readFile(path.join(OUTPUT, 'documentation-manifest.json'), 'utf8'));
    const routes = documentationRoutes();
    assert(pages.length === routes.length, 'Documentation manifest does not cover every source page');
    assert(new Set(pages.map((page) => page.markdownUrl)).size === routes.length, 'Duplicate Markdown routes');
    for (const relative of generatedDocumentationPaths()) await fs.access(path.join(OUTPUT, relative));

    for (const page of pages) {
        const route = new URL(page.htmlUrl).pathname.replace(/^\/+|\/+$/g, '');
        const { html, url } = await readRenderedPage(route);
        const $ = load(html);
        const expected = convertPage(html, url);
        const markdown = await fs.readFile(path.join(OUTPUT, new URL(page.markdownUrl).pathname), 'utf8');
        assert(markdown === expected.markdown, `${route}: Markdown differs from rendered documentation`);
        assert(await fs.readFile(path.join(OUTPUT, route, 'index.md'), 'utf8') === markdown, `${route}: directory Markdown differs`);
        assert(await fs.readFile(path.join(OUTPUT, new URL(page.legacyUrl).pathname), 'utf8') === markdown, `${route}: legacy download differs`);
        const alternate = $('link[rel="alternate"][type="text/markdown"]').attr('href');
        assert(alternate && new URL(alternate, BASE_URL).pathname === `${new URL(url).pathname.replace(/\/$/, '')}.md`, `${route}: missing or incorrect Markdown alternate`);
        assert($('link[rel="canonical"]').attr('href') && new URL($('link[rel="canonical"]').attr('href')!).pathname === new URL(url).pathname, `${route}: incorrect canonical URL`);
        const graphs = $('script[type="application/ld+json"]').toArray().flatMap((node) => JSON.parse($(node).text())['@graph'] ?? []);
        const article = graphs.find((item) => ['TechArticle', 'WebPage'].includes(item['@type']));
        assert(article?.headline === page.title && new URL(article.url).pathname === new URL(url).pathname, `${route}: structured data differs from page`);
        assert(graphs.some((item) => item['@type'] === 'BreadcrumbList'), `${route}: missing breadcrumbs`);

        if (route.startsWith('list/v3/react/examples/')) {
            const slug = route.split('/').at(-1)! as keyof typeof LIST_EXAMPLE_DOCS_BY_SLUG;
            const example = LIST_EXAMPLE_DOCS_BY_SLUG[slug];
            if (example) {
                const source = (await fs.readFile(path.join(OUTPUT, '..', 'vendor/legend-list', `${example.sourcePath}.txt`), 'utf8')).trim();
                assert(expected.codeBlocks.some((block) => block.language === 'tsx' && block.code === source), `${route}: canonical List source is incomplete`);
            }
        }
        const effect = catalog.effects.find((effect) => route === `slides/effects/${effect.slug}`);
        if (effect) {
            assert(expected.codeBlocks.some((block) => block.language === 'mdx' && block.code === effect.snippet), `${route}: effect snippet is incomplete`);
            assert(effect.props.every((prop) => markdown.includes(prop.name)), `${route}: effect configuration is incomplete`);
        }
        if (route === 'state/v3/react/react-examples') {
            assert(expected.codeBlocks.length === 7 && expected.codeBlocks.every((block) => block.language === 'tsx'), `${route}: duplicate or incomplete editor examples`);
        }
    }

    for (const indexPath of generatedDocumentationPaths()) {
        if (!indexPath.endsWith('/llms.txt') && indexPath !== 'llms.txt') continue;
        const index = await fs.readFile(path.join(OUTPUT, indexPath), 'utf8');
        assert(index.startsWith('# ') && index.length < 100_000, `${indexPath}: invalid or oversized index`);
        for (const match of index.matchAll(/\]\((https?:\/\/[^)]+)\)/g)) {
            const url = new URL(match[1]);
            if (url.origin !== new URL(BASE_URL).origin) continue;
            const destination = url.pathname.endsWith('/') ? path.join(url.pathname, 'index.html') : url.pathname;
            await fs.access(path.join(OUTPUT, destination));
        }
    }
    console.log(`Verified ${pages.length} Markdown pages, alternates, structured data, indexes, and canonical examples.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await validateExports();
