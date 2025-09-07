import { source } from '@/lib/sources/motion';
import DocsPageTemplate, { createGenerateStaticParams, createGenerateMetadata } from '@/components/docs-page-template';
import { getFirstDocsPath } from '@/lib/getDocsPath';
import { redirect } from 'next/navigation';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
    const params = await props.params;
    if (params.slug?.length === 1 && params.slug[0] === 'v2') {
        redirect(getFirstDocsPath('motion'));
    } else {
        return <DocsPageTemplate source={source} params={props.params} />;
    }
}

export const generateStaticParams = createGenerateStaticParams(source);
export const generateMetadata = createGenerateMetadata(source);
