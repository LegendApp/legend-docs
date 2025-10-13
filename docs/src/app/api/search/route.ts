import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const revalidate = false;
export const dynamic = 'force-static';

export const { staticGET: GET } = createFromSource(source, {
    language: 'english',
});
