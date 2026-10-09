import Link from 'next/link';
import { documentContext, documentationSchema, markdownPath, serializeStructuredData, SITE_URL, type DocumentDetails } from '@/lib/documentation';

export function DocumentationStructuredData({ page, ancestors }: { page: DocumentDetails; ancestors?: DocumentDetails[] }) {
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(documentationSchema(page, ancestors)) }} />;
}

export function DocumentationContext({ url }: { url: string }) {
    const { project, version, archived } = documentContext(url);
    return <aside className="mb-6 text-sm text-fd-muted-foreground" aria-label="Documentation status">
        {version && <p>{project?.name} {version} documentation. {archived ? <><strong>Archived version.</strong> <Link href={project!.currentDocs!}>Read the current documentation.</Link></> : 'Current documentation version.'}</p>}
        {project?.status && <p>{project.name}: {project.status}.</p>}
        {project?.slug === 'spark' && <p>These guides cover source SDK APIs; the published preview can differ. <Link href="/spark/limitations/">Check release status.</Link></p>}
    </aside>;
}

export function DocumentationLinks({ page }: { page: DocumentDetails }) {
    const issue = new URL('https://github.com/LegendApp/legend-docs/issues/new');
    issue.searchParams.set('title', `Docs: ${page.title}`);
    issue.searchParams.set('body', `Page: ${new URL(page.url, SITE_URL).href}\n\nWhat is incorrect or missing?\n\nExpected behavior or supporting source:\n`);
    return <footer className="mt-8 flex flex-wrap gap-4 text-sm">
        <a href={markdownPath(page.url)}>View Markdown</a>
        <a href={issue.href}>Report a documentation correction</a>
    </footer>;
}

export function SiteStructuredData() {
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData({
        '@context': 'https://schema.org', '@graph': [
            { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'Legend', url: SITE_URL,
                sameAs: ['https://github.com/LegendApp', 'https://www.npmjs.com/org/legendapp'] },
            { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: 'Legend', url: SITE_URL,
                publisher: { '@id': `${SITE_URL}/#organization` } },
        ],
    }) }} />;
}
