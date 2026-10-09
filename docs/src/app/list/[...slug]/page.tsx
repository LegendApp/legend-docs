import { source } from '@/lib/sources/list';
import DocsPageTemplate, { createGenerateStaticParams, createGenerateMetadata } from '@/components/docs-page-template';
import { redirect } from 'next/navigation';
import { getDocumentationRedirect } from '@/lib/getDocsPath';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
    const params = await props.params;
    const destination = getDocumentationRedirect('/list/' + (params.slug ?? []).join('/'));
    if (destination) redirect(destination);
    return <DocsPageTemplate source={source} params={props.params} />;
}

export const generateStaticParams = createGenerateStaticParams(source);
export const generateMetadata = createGenerateMetadata(source);
