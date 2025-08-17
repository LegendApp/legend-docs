import type { Metadata } from 'next';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';

interface DocsSource {
    getPage: (slug?: string[]) => any;
    generateParams: () => any;
}

interface DocsPageTemplateProps {
    source: DocsSource;
    params: Promise<{ slug?: string[] }>;
}

export default async function DocsPageTemplate({ source, params }: DocsPageTemplateProps) {
    const resolvedParams = await params;
    const page = source.getPage(resolvedParams.slug);
    if (!page) notFound();

    const MDX = page.data.body;

    return (
        <DocsPage
            toc={page.data.toc}
            full={page.data.full}
            tableOfContent={{
                style: 'clerk',
            }}
        >
            <DocsTitle>{page.data.title}</DocsTitle>
            <DocsDescription>{page.data.description}</DocsDescription>
            <DocsBody>
                <MDX
                    components={getMDXComponents({
                        pre: ({ ref: _ref, ...props }) => (
                            <CodeBlock {...props}>
                                <Pre>{props.children}</Pre>
                            </CodeBlock>
                        ),
                    })}
                />
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

        return {
            title: page.data.title,
            description: page.data.description,
        };
    };
}