import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { removeFilenameDatePrefix } from '@/lib/blog-routing';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
    const paths = new Set(['/', '/list/', '/state/', '/motion/', '/blog/']);
    for (const page of source.getPages()) {
        const url = page.url.startsWith('/blog/') ? `/blog/${removeFilenameDatePrefix(page.slugs[1])}` : page.url;
        paths.add(`${url.replace(/\/$/, '')}/`);
    }
    return [...paths].map((path) => ({ url: `https://legend.so${path}` }));
}
