import { source } from '@/lib/sources/state';
import DocsPageTemplate, { createGenerateStaticParams, createGenerateMetadata } from '@/components/docs-page-template';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
    return <DocsPageTemplate source={source} params={props.params} />;
}

export const generateStaticParams = createGenerateStaticParams(source);
export const generateMetadata = createGenerateMetadata(source);
