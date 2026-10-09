import { source } from '@/lib/sources/state';
import DocsPageTemplate, { createGenerateStaticParams, createGenerateMetadata } from '@/components/docs-page-template';
import { getDocumentationRedirect } from '@/lib/getDocsPath';
import { redirect } from 'next/navigation';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
    const params = await props.params;
    const destination = getDocumentationRedirect('/state/' + (params.slug ?? []).join('/'));
    if (destination) redirect(destination);
    return <DocsPageTemplate source={source} params={props.params} />;
}

export const generateStaticParams = createGenerateStaticParams(source);
export const generateMetadata = createGenerateMetadata(source);
