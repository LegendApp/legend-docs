import { source } from '@/lib/sources/blog';
import type { Metadata } from 'next';
import { DocsPage, DocsBody } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { CustomNavbar } from '@/components/navbar';
import { getMDXComponents } from '@/mdx-components';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { extractDateFromSlug } from '@/lib/extractDateFromSlug';

function addFilenameDatePrefix(slug: string): string {
    // Try to find the original page with date prefix
    const pages = source.getPages();
    const pageWithPrefix = pages.find((p) => p.slugs[0].endsWith(`-${slug}`) || p.slugs[0] === slug);
    if (pageWithPrefix) {
        return pageWithPrefix.slugs[0];
    }
    // If not found, assume it might already have the prefix
    return slug;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    // Try to find page with the original filename (with date prefix)
    const originalSlug = addFilenameDatePrefix(resolvedParams.slug);
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

    return (
        <div className="pt-12 blog-page">
            <div className="relative container px-4 py-8 lg:py-12 lg:px-6 text-left mx-auto max-w-(--fd-page-width)">
                <div className="mb-4 text-gray-600 dark:text-gray-400 text-sm font-medium">
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

                <h1 className="text-left dark:text-white text-4xl font-bold mb-4">{page.data.title}</h1>

                {page.data.description && (
                    <p className="text-left mt-3 dark:text-gray-300 text-lg">{page.data.description}</p>
                )}
            </div>

            <DocsLayout
                nav={{ component: <CustomNavbar /> }}
                tree={{
                    name: 'Tree',
                    children: [],
                }}
                sidebar={{ enabled: false, prefetch: false, tabs: false }}
                containerProps={{
                    className: 'flex-row-reverse relative container pt-0 [&>*]:pt-0',
                }}
            >
                <DocsPage
                    toc={page.data.toc}
                    full={page.data.full}
                    footer={{
                        enabled: false,
                    }}
                    tableOfContent={{
                        style: 'clerk',
                        single: false,
                    }}
                    container={{
                        className: 'border-t border-white/10',
                    }}
                    article={{
                        className:
                            'col-span-4 xl:col-span-3 order-last !m-[unset] max-w-none bg-zinc-50/50 dark:bg-zinc-900/50 py-8 md:py-12 border-l border-r border-white/10',
                    }}
                >
                    <DocsBody>
                        <MDX
                            components={getMDXComponents({
                                pre: (props) => (
                                    <CodeBlock {...props}>
                                        <Pre>{props.children}</Pre>
                                    </CodeBlock>
                                ),
                            })}
                        />
                    </DocsBody>
                </DocsPage>
            </DocsLayout>
        </div>
    );
}

export async function generateStaticParams() {
    const params = source.generateParams();
    return params.map((param) => ({
        // Remove date prefix from slug for cleaner URLs
        slug: param.slug[0].replace(/^\d{4}-\d{2}-\d{2}-/, ''),
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    // Try to find page with the original filename (with date prefix)
    const originalSlug = addFilenameDatePrefix(resolvedParams.slug);
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
