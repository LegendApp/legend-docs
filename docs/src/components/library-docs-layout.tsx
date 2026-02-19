import { baseOptions } from '@/app/layout.config';
import { SidebarSearchBanner } from '@/components/sidebar-search-banner';
import { DocsLayout, type DocsLayoutProps } from 'fumadocs-ui/layouts/notebook';
import type { ReactNode } from 'react';

type LibraryDocsLayoutProps = {
    tree: DocsLayoutProps['tree'];
    title: string;
    tabs: NonNullable<NonNullable<DocsLayoutProps['sidebar']>['tabs']>;
    children: ReactNode;
};

export function LibraryDocsLayout({ tree, title, tabs, children }: LibraryDocsLayoutProps) {
    return (
        <DocsLayout
            tree={tree}
            {...baseOptions}
            nav={{
                title: (
                    <span className="inline-block pb-1 text-[1.1rem] font-bold tracking-tight text-fd-foreground">
                        {title}
                    </span>
                ),
                mode: 'auto',
            }}
            themeSwitch={{
                enabled: false,
            }}
            searchToggle={{
                enabled: false,
            }}
            sidebar={{
                defaultOpenLevel: 1,
                collapsible: false,
                banner: <SidebarSearchBanner />,
                tabs,
            }}
        >
            {children}
        </DocsLayout>
    );
}
