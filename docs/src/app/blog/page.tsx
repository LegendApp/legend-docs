import { source } from '@/lib/sources/blog';
import Link from 'next/link';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { CustomNavbar } from '@/components/navbar';
import { extractDateFromSlug } from '@/lib/extractDateFromSlug';
import { removeFilenameDatePrefix, sanitizeBlogPageTree } from '@/lib/blog-routing';

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
        <DocsLayout tree={tree} sidebar={{}} nav={{ component: <CustomNavbar /> }}>
            <div className="blog-page flex flex-1 flex-col">
                <div className="mx-auto w-full max-w-[1200px] px-4 pt-24 pb-12 sm:px-6 lg:px-8 lg:pt-28">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-12 text-center">
                            <h1 className="mb-4 text-4xl font-bold tracking-tight">Legend Open Source Blog</h1>
                            <p className="text-lg text-fd-muted-foreground">
                                Latest updates from the Legend open source projects
                            </p>
                            <div className="mt-8 rounded-lg bg-muted/30 border border-border/50 px-4 py-3 inline-block">
                                <p className="text-sm text-fd-muted-foreground">
                                    📝 A post about Legend List is coming soon!
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-8">
                            {posts.map((post) => (
                                <article key={post.slugs[0]} className="group relative">
                                    <div className="rounded-xl border bg-card p-8 transition-colors hover:bg-muted/50">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-4 text-sm text-fd-muted-foreground">
                                                <time dateTime={post.data.date?.toString()}>
                                                    {new Date(post.data.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </time>
                                                {post.data.author && (
                                                    <>
                                                        <span>•</span>
                                                        <span>By {post.data.author}</span>
                                                    </>
                                                )}
                                            </div>

                                            <h2 className="text-2xl font-semibold tracking-tight">
                                                <Link
                                                    href={`/blog/${post.slugs[0]}`}
                                                    className="after:absolute after:inset-0 hover:text-primary"
                                                >
                                                    {post.data.title}
                                                </Link>
                                            </h2>

                                            {post.data.description && (
                                                <p className="text-fd-muted-foreground line-clamp-2">
                                                    {post.data.description}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                Read more
                                                <svg
                                                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}

                            {posts.length === 0 && (
                                <div className="py-24 text-center">
                                    <p className="text-lg text-fd-muted-foreground">
                                        No blog posts yet. Check back soon for updates!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DocsLayout>
    );
}
