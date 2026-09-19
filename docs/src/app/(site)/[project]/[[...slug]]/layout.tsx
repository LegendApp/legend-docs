import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { source } from '@/lib/source';
import { getProject, projects } from '@/lib/projects';
import { Navbar, SearchButton } from '@/components/site/navbar';
import { ProjectIcon } from '@/components/site/project-icon';
import { Footer } from '@/components/site/footer';
import { navigation } from '@/lib/navigation';

function SidebarFooter() {
    return (
        <div className="sidebar-footer">
            <span>Part of the Legend family.</span>
            <Link href="/">Explore all projects ↗</Link>
        </div>
    );
}

export default async function ProjectLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ project: string; slug?: string[] }>;
}) {
    const { project: slug, slug: pageSlug = [] } = await params;
    const project = getProject(slug);
    if (!project) notFound();

    if (slug === 'framework' && pageSlug.length === 0) {
        return (
            <>
                <Navbar />
                {children}
                <Footer />
            </>
        );
    }

    return (
        <DocsLayout
            tree={source.pageTree}
            nav={{
                title: (
                    <span className="brand docs-brand">
                        <Image src="/assets/logo.png" alt="" width={23} height={23} />
                        <span>Legend</span>
                    </span>
                ),
                mode: 'auto',
            }}
            links={[
                { text: 'Home', url: '/', active: 'url' },
                ...navigation.map(({ title, url }) => ({
                    text: title,
                    url,
                    active: 'nested-url' as const,
                })),
            ]}
            themeSwitch={{ enabled: false }}
            searchToggle={{ enabled: false }}
            sidebar={{
                collapsible: false,
                prefetch: false,
                defaultOpenLevel: 1,
                banner: <SearchButton expanded />,
                tabs: projects
                    .filter((item) => item.category !== 'library')
                    .map((item) => ({
                        title: item.name,
                        description: item.category === 'library' ? 'Open-source library' : item.status,
                        url: `/${item.slug}`,
                        icon: <ProjectIcon slug={item.slug} size={19} />,
                    })),
                footer: SidebarFooter,
            }}
        >
            {children}
        </DocsLayout>
    );
}
