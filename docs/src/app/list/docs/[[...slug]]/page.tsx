import { source } from '@/lib/sources/list';
import DocsPageTemplate, { createGenerateStaticParams, createGenerateMetadata } from '@/components/docs-page-template';
import { redirect } from 'next/navigation';
import { getFirstDocsPath } from '@/lib/getDocsPath';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
    console.log('params', props);
    const params = await props.params;
    if (params.slug?.length === 1 && params.slug[0] === 'v2') {
        redirect(getFirstDocsPath('list'));
    } else {
        return <DocsPageTemplate source={source} params={props.params} />;
    }
}

export const generateStaticParams = createGenerateStaticParams(source);
export const generateMetadata = createGenerateMetadata(source);
