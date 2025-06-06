import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { sortDocsByCategory, getProjectSidebarOrder } from 'shared/src/docSorting';

const docs = await getCollection('docs');

// Get sidebar order from config
const sidebarOrder = await getProjectSidebarOrder(import.meta.url);

export const GET: APIRoute = async ({}) => {
    // Sort the docs using the shared helper
    const sortedDocs = sortDocsByCategory(docs, sidebarOrder);

    return new Response(
        `# Legend State Full Documentation\n\n${sortedDocs
            .map((doc) => {
                return `# ${doc.data.title}\n\n${doc.body}\n\n`;
            })
            .join('')}`,
        { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    );
};
