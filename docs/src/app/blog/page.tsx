import { source } from '@/lib/sources/blog';
import Link from 'next/link';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { CustomNavbar } from '@/components/navbar';

export default async function BlogPage() {
  const posts = source.getPages().sort((a, b) => {
    const dateA = new Date(a.data.date);
    const dateB = new Date(b.data.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <DocsLayout tree={source.pageTree} nav={{ component: <CustomNavbar /> }}>
      <div className="flex flex-1 flex-col divide-y divide-dashed divide-border/70 border-border/70 border-dashed sm:border-b dark:divide-border dark:border-border">
        <div className="container mx-auto px-6 py-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h1 className="mb-4 text-5xl font-bold tracking-tight">Blog</h1>
              <p className="text-lg text-muted-foreground">
                Latest updates, tutorials, and insights from the Legend team
              </p>
            </div>
            
            <div className="grid gap-8">
              {posts.map((post) => (
                <article key={post.slugs[0]} className="group relative">
                  <div className="rounded-xl border bg-card p-8 transition-colors hover:bg-muted/50">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                        <p className="text-muted-foreground line-clamp-2">
                          {post.data.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        Read more
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
              
              {posts.length === 0 && (
                <div className="py-24 text-center">
                  <p className="text-lg text-muted-foreground">
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