import { blogPosts } from '@/.source';
import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';

export const source = loader({
    baseUrl: '/blog',
    source: toFumadocsSource(blogPosts, []),
});
