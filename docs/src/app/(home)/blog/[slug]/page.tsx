import { source } from '@/lib/sources/blog';
import type { Metadata } from 'next';
import { DocsPage, DocsBody } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { CustomNavbar } from '@/components/navbar';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const page = source.getPage([params.slug]);
    if (!page) notFound();

    const MDX = page.data.body;

    return (
        <DocsLayout tree={source.pageTree} nav={{ component: <CustomNavbar /> }}>
            <DocsPage toc={page.data.toc} full>
                <DocsBody>
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-4">{page.data.title}</h1>
                        <div className="text-gray-600 mb-4">
                            By {page.data.author} on {new Date(page.data.date).toLocaleDateString()}
                        </div>
                        {page.data.description && <p className="text-lg text-gray-700 mb-6">{page.data.description}</p>}
                    </div>
                    <InlineTOC items={page.data.toc} />
                    <MDX />
                </DocsBody>
            </DocsPage>
        </DocsLayout>
    );
}

export async function generateStaticParams() {
    console.log('generateStaticParams', source.generateParams());
    const params = await source.generateParams();
    console.log('params', params);
    params[0].slug = params[0].slug[0];
    return params;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const page = source.getPage([params.slug]);
    if (!page) notFound();

    return {
        title: page.data.title,
        description: page.data.description,
    };
}
