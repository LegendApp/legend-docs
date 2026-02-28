import { source } from '@/lib/sources/blog';
import Link from 'next/link';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { extractDateFromSlug } from '@/lib/extractDateFromSlug';
import { removeFilenameDatePrefix, sanitizeBlogPageTree } from '@/lib/blog-routing';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { CustomNavbar } from '@/components/navbar';

export default async function BlogPage() {
    const posts = source
        .getPages()
        .map((post) => ({
            ...post,
            // Extract date from original slug if not in frontmatter
            data: {
                ...post.data,
                date: extractDateFromSlug(post.slugs[0]),
            },
            // Remove date prefix from slugs for cleaner URLs
            slugs: post.slugs.map((slug) => removeFilenameDatePrefix(slug)),
        }))
        .sort((a, b) => {
            const dateA = new Date(a.data.date);
            const dateB = new Date(b.data.date);
            return dateB.getTime() - dateA.getTime();
        });

    const tree = sanitizeBlogPageTree(source.pageTree);

    return (
        <DocsLayout
            tree={tree}
            sidebar={{
                collapsible: false
            }}
            nav={{ component: <CustomNavbar hideSidebarTrigger /> }}
            containerProps={{
                className: 'pt-[var(--fd-nav-height)]',
            }}
        >
            <DocsPage
                breadcrumb={{ enabled: false }}
                footer={{ enabled: false }}
                tableOfContent={{ enabled: false }}
            >
                <DocsTitle>Legend Open Source Blog</DocsTitle>
                <DocsDescription>Latest updates from the Legend open source projects</DocsDescription>

                <DocsBody>
                    <div className="not-prose">
                        {posts.map((post) => (
                            <article
                                key={post.slugs[0]}
                                className="rounded-lg mb-6 max-w-xl mx-auto bg-fd-card border border-fd-border"
                            >
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-white">
                                        <Link href={`/blog/${post.slugs[0]}`} className="hover:text-fd-primary transition-colors">
                                            {post.data.title}
                                        </Link>
                                    </h2>
                                    <p className="mt-2 text-sm text-fd-muted-foreground">
                                        <time dateTime={post.data.date?.toString()}>
                                            {new Date(post.data.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </time>
                                        {post.data.author ? <> • By {post.data.author}</> : null}
                                    </p>
                                    {post.data.description && (
                                        <p className="mt-4 text-fd-muted-foreground">{post.data.description}</p>
                                    )}
                                </div>

                            </article>
                        ))}

                        {posts.length === 0 && (
                            <p className="text-fd-muted-foreground">No blog posts yet. Check back soon for updates!</p>
                        )}
                    </div>
                </DocsBody>
            </DocsPage>
        </DocsLayout>
    );
}
