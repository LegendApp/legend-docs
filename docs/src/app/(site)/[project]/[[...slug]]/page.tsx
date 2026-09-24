import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { source } from '@/lib/source';
import { getProject } from '@/lib/projects';
import { ProjectIcon } from '@/components/site/project-icon';
import { FrameworkLanding } from '@/components/site/framework-landing';

type Params = { project: string; slug?: string[] };
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
    return source
        .getPages()
        .filter((page) => {
            const project = getProject(page.slugs[0]);
            return project && project.category !== 'library';
        })
        .map((page) => ({ project: page.slugs[0], slug: page.slugs.slice(1) }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { project, slug = [] } = await params;
    const page = source.getPage([project, ...slug]);
    if (!page) notFound();
    return {
        title: page.data.title,
        description: page.data.description,
        alternates: { canonical: page.url },
    };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
    const { project: projectSlug, slug = [] } = await params;
    const project = getProject(projectSlug);
    const page = source.getPage([projectSlug, ...slug]);
    if (!page || !project) notFound();
    if (projectSlug === 'spark' && slug.length === 0) return <FrameworkLanding />;
    const MDX = page.data.body;

    return (
        <DocsPage toc={page.data.toc} tableOfContent={{ style: 'clerk' }}>
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
            <DocsBody>
                <MDX components={defaultMdxComponents} />
            </DocsBody>
        </DocsPage>
    );
}
