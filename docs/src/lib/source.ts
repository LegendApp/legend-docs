import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';
import { removeFilenameDatePrefix } from './blog-routing';

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
    // it assigns a URL to your pages
    baseUrl: '/',
    url: (slugs) =>
        '/' +
        slugs
            .map((slug, index) => (slugs[0] === 'blog' && index === 1 ? removeFilenameDatePrefix(slug) : slug))
            .join('/'),
    source: docs.toFumadocsSource(),
});
