import type { Metadata } from 'next';
import { getProject } from './projects';

export const SITE_URL = 'https://legend.so';
export type DocumentDetails = { title: string; description?: string; url: string };

export function canonicalPath(url: string) {
    return `${new URL(url, SITE_URL).pathname.replace(/\/$/, '')}/`;
}

export function documentContext(url: string) {
    const parts = new URL(url, SITE_URL).pathname.split('/').filter(Boolean);
    const project = getProject(parts[0]);
    const version = project?.category === 'library' ? parts[1] : undefined;
    const currentVersion = project?.currentDocs?.split('/')[2];
    return { project, version, currentVersion, archived: Boolean(version && version !== currentVersion), landing: parts.length === 1 };
}

export function markdownPath(url: string) {
    return `${new URL(url, SITE_URL).pathname.replace(/\/$/, '')}.md`;
}

export function documentationMetadata(page: DocumentDetails): Metadata {
    return {
        title: page.title,
        description: page.description ?? `${page.title} — ${documentContext(page.url).project?.name ?? 'Legend'} documentation.`,
        alternates: { canonical: canonicalPath(page.url), types: { 'text/markdown': markdownPath(page.url) } },
    };
}

export function documentationSchema(page: DocumentDetails, ancestors: DocumentDetails[] = []) {
    const context = documentContext(page.url);
    const canonical = new URL(canonicalPath(page.url), SITE_URL).href;
    const crumbs = [{ title: 'Legend', url: '/' }];
    if (context.project && !context.landing) crumbs.push({ title: context.project.name, url: `/${context.project.slug}/` });
    crumbs.push(...ancestors.map(({ title, url }) => ({ title, url })), { title: page.title, url: page.url });
    return {
        '@context': 'https://schema.org',
        '@graph': [
            { '@type': context.landing ? 'WebPage' : 'TechArticle', '@id': `${canonical}#article`, url: canonical,
                headline: page.title, description: documentationMetadata(page).description, version: context.version,
                inLanguage: 'en', publisher: { '@id': `${SITE_URL}/#organization` } },
            { '@type': 'BreadcrumbList', itemListElement: crumbs.map((crumb, index) => ({
                '@type': 'ListItem', position: index + 1, name: crumb.title, item: new URL(canonicalPath(crumb.url), SITE_URL).href,
            })) },
        ],
    };
}

export function serializeStructuredData(value: unknown) {
    return JSON.stringify(value).replace(/</g, '\\u003c');
}
