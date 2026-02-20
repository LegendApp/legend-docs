import { Example } from '@/components/Example';
import { TwoExamples } from '@/components/TwoExamples';
import { source } from '@/lib/sources/blog';
import type { Metadata } from 'next';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { CustomNavbar } from '@/components/navbar';
import { getMDXComponents } from '@/mdx-components';
import { CodeBlock, CodeBlockProps, Pre } from 'fumadocs-ui/components/codeblock';
import { extractDateFromSlug } from '@/lib/extractDateFromSlug';
import '@/styles/blog-post.css';
import { findOriginalBlogSlug, removeFilenameDatePrefix, sanitizeBlogPageTree } from '@/lib/blog-routing';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const originalSlug = findOriginalBlogSlug(resolvedParams.slug, source.getPages());
    let page = source.getPage([originalSlug]);

    // If not found with prefix, try without
    if (!page) {
        page = source.getPage([resolvedParams.slug]);
    }

    if (!page) notFound();

    // Extract date from filename if not in frontmatter
    const pageData = {
        ...page.data,
        date: extractDateFromSlug(originalSlug),
    };

    const MDX = page.data.body;
    const tree = sanitizeBlogPageTree(source.pageTree);

    return (
        <DocsLayout nav={{ component: <CustomNavbar /> }} tree={tree} sidebar={{}}>
            <DocsPage
                toc={page.data.toc}
                full={page.data.full}
                className="!pt-[calc(var(--fd-nav-height)+1.5rem)] md:!pt-[calc(var(--fd-nav-height)+2rem)]"
                tableOfContent={{
                    style: 'clerk',
                }}
            >
                <div className="mb-4 text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                    <div className="flex flex-wrap gap-3">
                        <span className="inline-flex items-center gap-1.5">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            {new Date(pageData.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                        {page.data.author && (
                            <>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1.5">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    {page.data.author}
                                </span>
                            </>
                        )}
                    </div>
                </div>
                <DocsTitle>{page.data.title}</DocsTitle>
                <DocsDescription>{page.data.description}</DocsDescription>
                <DocsBody className="blog-post">
                    <MDX
                        components={getMDXComponents({
                            pre: (props) => (
                                <CodeBlock {...(props as CodeBlockProps)}>
                                    <Pre>{props.children}</Pre>
                                </CodeBlock>
                            ),
                            Example,
                            TwoExamples,
                        })}
                    />
                </DocsBody>
            </DocsPage>
        </DocsLayout>
    );
}

export async function generateStaticParams() {
    const params = source.generateParams();
    return params.map((param) => ({
        slug: removeFilenameDatePrefix(param.slug[0]),
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const originalSlug = findOriginalBlogSlug(resolvedParams.slug, source.getPages());
    let page = source.getPage([originalSlug]);

    // If not found with prefix, try without
    if (!page) {
        page = source.getPage([resolvedParams.slug]);
    }

    if (!page) notFound();

    return {
        title: page.data.title,
        description: page.data.description,
    };
}
