import type { Metadata } from 'next';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import { DocumentationStructuredData, DocumentationContext, DocumentationLinks } from '@/components/documentation-details';
import { documentationMetadata, type DocumentDetails } from '@/lib/documentation';
import { CodeBlock, CodeBlockProps, Pre } from 'fumadocs-ui/components/codeblock';

type DocsSource = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getPage: (slug?: string[]) => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generateParams: () => any;
};

interface DocsPageTemplateProps {
    source: DocsSource;
    params: Promise<{ slug?: string[] }>;
}

export default async function DocsPageTemplate({ source, params }: DocsPageTemplateProps) {
    const resolvedParams = await params;
    const page = source.getPage(resolvedParams.slug);
    if (!page) notFound();

    const MDX = page.data.body;
    const details = { title: page.data.title, description: page.data.description, url: page.url };
    const ancestors: DocumentDetails[] = [];
    const slugs = resolvedParams.slug ?? [];
    for (let count = 2; count < slugs.length; count++) {
        const parent = source.getPage(slugs.slice(0, count));
        if (parent) ancestors.push({ title: parent.data.title, url: parent.url });
    }

    return (
        <DocsPage
            toc={page.data.toc}
            full={page.data.full}
            tableOfContent={{
                style: 'clerk',
            }}
        >
            <DocumentationStructuredData page={details} ancestors={ancestors} />
            <DocsTitle>{page.data.title}</DocsTitle>
            <DocsDescription>{page.data.description}</DocsDescription>
            <DocsBody data-doc-content>
                <DocumentationContext url={page.url} />
                <MDX
                    components={getMDXComponents({
                        pre: (props) => (
                            <CodeBlock {...(props as CodeBlockProps)}>
                                <Pre>{props.children}</Pre>
                            </CodeBlock>
                        ),
                    })}
                />
                <DocumentationLinks page={details} />
            </DocsBody>
        </DocsPage>
    );
}

export function createGenerateStaticParams(source: DocsSource) {
    return async function generateStaticParams() {
        return source.generateParams();
    };
}

export function createGenerateMetadata(source: DocsSource) {
    return async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
        const params = await props.params;
        const page = source.getPage(params.slug);
        if (!page) notFound();

        return documentationMetadata({ title: page.data.title, description: page.data.description, url: page.url });
    };
}
