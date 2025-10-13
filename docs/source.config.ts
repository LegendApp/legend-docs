import { defineConfig, defineDocs, defineCollections, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineDocs({
    dir: 'content',
    docs: {
        schema: frontmatterSchema,
    },
    meta: {
        schema: metaSchema,
    },
});

export const listDocs = defineDocs({
    dir: 'content/list',
    docs: {
        schema: frontmatterSchema,
    },
    meta: {
        schema: metaSchema,
    },
});

export const stateDocs = defineDocs({
    dir: 'content/state',
    docs: {
        schema: frontmatterSchema,
    },
    meta: {
        schema: metaSchema,
    },
});

export const motionDocs = defineDocs({
    dir: 'content/motion',
    docs: {
        schema: frontmatterSchema,
    },
    meta: {
        schema: metaSchema,
    },
});

export const blogPosts = defineCollections({
    type: 'doc',
    dir: 'content/blog',
    schema: frontmatterSchema.extend({
        author: z.string(),
    }),
});

export default defineConfig({
    mdxOptions: {
        // MDX options
    },
});
