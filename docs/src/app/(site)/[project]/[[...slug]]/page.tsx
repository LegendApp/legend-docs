import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { source } from '@/lib/source';
import { appHomepages, getProject } from '@/lib/projects';
import { getAppHomepageRedirect, removedAppSlugs } from '@/lib/getDocsPath';
import { AppLanding } from '@/components/site/app-landing';
import { ProjectIcon } from '@/components/site/project-icon';
import { FrameworkLanding } from '@/components/site/framework-landing';
import { SlidesLanding } from '@/components/site/slides-landing';
import { SlidesEffectsLanding } from '@/components/site/slides-effects-landing';
import { DocumentationStructuredData, DocumentationContext, DocumentationLinks } from '@/components/documentation-details';
import { documentationMetadata, type DocumentDetails } from '@/lib/documentation';

type Params = { project: string; slug?: string[] };
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
    const docs = source
        .getPages()
        .filter((page) => {
            const project = getProject(page.slugs[0]);
            return project && project.category !== 'library' && !project.homepage;
        })
        .map((page) => ({ project: page.slugs[0], slug: page.slugs.slice(1) }));
    return [...docs, ...[...appHomepages.map((project) => project.slug), ...removedAppSlugs].flatMap((project) =>
        [[], ['availability'], ['reference']].map((slug) => ({ project, slug }))
    )];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { project, slug = [] } = await params;
    if (removedAppSlugs.includes(project)) return {};
    const app = getProject(project);
    if (app?.homepage) {
        return {
            title: app.name,
            description: app.description,
            alternates: { canonical: `/${project}/` },
        };
    }
    const page = source.getPage([project, ...slug]);
    if (!page) notFound();
    return documentationMetadata({ title: page.data.title, description: page.data.description, url: page.url });
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
    const { project: projectSlug, slug = [] } = await params;
    const redirect = getAppHomepageRedirect(`/${projectSlug}/${slug.join('/')}`);
    if (redirect) permanentRedirect(redirect);
    const project = getProject(projectSlug);
    if (!project) notFound();
    if (project.homepage && slug.length === 0) return <AppLanding project={project} />;
    const page = source.getPage([projectSlug, ...slug]);
    if (!page) notFound();
    const details = { title: page.data.title, description: page.data.description, url: page.url };
    if (projectSlug === 'spark' && slug.length === 0) return <><DocumentationStructuredData page={details} /><FrameworkLanding /></>;
    if (projectSlug === 'slides' && slug.length === 0) return <>
        <DocumentationStructuredData page={details} />
        <div className="container pt-6">
            <span className="rounded-md border border-amber-300/40 bg-amber-300/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-200">
                Early MVP
            </span>
        </div>
        <SlidesLanding />
    </>;
    if (projectSlug === 'slides' && slug.join('/') === 'effects') return <><DocumentationStructuredData page={details} /><SlidesEffectsLanding /></>;
    const ancestors: DocumentDetails[] = [];
    for (let count = 1; count < slug.length; count++) {
        const parent = source.getPage([projectSlug, ...slug.slice(0, count)]);
        if (parent) ancestors.push({ title: parent.data.title, url: parent.url });
    }
    const MDX = page.data.body;

    return (
        <DocsPage toc={page.data.toc} tableOfContent={{ style: 'clerk' }}>
            <DocumentationStructuredData page={details} ancestors={ancestors} />
            <div className="docs-eyebrow">
                <ProjectIcon slug={projectSlug} size={19} />
                <span>
                    {project.category === 'library'
                        ? 'OPEN SOURCE'
                        : project.category === 'framework'
                          ? 'FRAMEWORK'
                          : project.category === 'demo'
                            ? 'FROM THE WORKBENCH'
                            : 'LEGEND APPS'}
                </span>
                {project.status && <span className="status-badge">{project.status}</span>}
            </div>
            <DocsTitle>{page.data.title}</DocsTitle>
            <DocsDescription>{page.data.description}</DocsDescription>
            <DocsBody data-doc-content>
                <DocumentationContext url={page.url} />
                <MDX components={defaultMdxComponents} />
                <DocumentationLinks page={details} />
            </DocsBody>
        </DocsPage>
    );
}
