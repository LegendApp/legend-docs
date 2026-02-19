import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/sources/motion';
import { SidebarSearchBanner } from '@/components/sidebar-search-banner';
import { TbHexagonNumber1Filled } from 'react-icons/tb';
import { getVersionTabUrls } from '@/lib/getVersionTabUrls';

export default function Layout({ children }: { children: ReactNode }) {
    const version2Url = '/motion/v2';

    return (
        <DocsLayout
            tree={source.pageTree}
            {...baseOptions}
            nav={{
                title: (
                    <span className="inline-block pb-1 text-[1.1rem] font-bold tracking-tight text-fd-foreground">
                        Legend Motion
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
                tabs: [
                    {
                        title: 'Version 2',
                        description: 'Current stable version',
                        url: version2Url,
                        urls: getVersionTabUrls(source.pageTree, version2Url),
                        icon: <TbHexagonNumber1Filled size={20} />,
                    },
                ],
            }}
        >
            {children}
        </DocsLayout>
    );
}
