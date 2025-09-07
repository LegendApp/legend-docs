import Link from 'next/link';
import { source } from '@/lib/sources/blog';

export default async function BlogPage() {
  const posts = source.getPages().sort((a, b) => {
    const dateA = new Date(a.data.date);
    const dateB = new Date(b.data.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.slugs[0]} className="border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-semibold mb-2">
              <Link 
                href={`/blog/${post.slugs[0]}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {post.data.title}
              </Link>
            </h2>
            <div className="text-gray-600 text-sm mb-3">
              By {post.data.author} on {new Date(post.data.date).toLocaleDateString()}
            </div>
            {post.data.description && (
              <p className="text-gray-700">{post.data.description}</p>
            )}
          </article>
        ))}
        {posts.length === 0 && (
          <p className="text-gray-600">No blog posts yet.</p>
        )}
      </div>
    </div>
  );
}