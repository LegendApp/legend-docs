import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/sources/state';
import { SidebarSearchBanner } from '@/components/sidebar-search-banner';
import { TbHexagonNumber2Filled, TbHexagonNumber3Filled } from 'react-icons/tb';
import { getFirstDocsPath } from '@/lib/getDocsPath';
import { getVersionTabUrls } from '@/lib/getVersionTabUrls';

export default function Layout({ children }: { children: ReactNode }) {
    const version2Url = getFirstDocsPath('state2');
    const version3Url = getFirstDocsPath('state');

    return (
        <DocsLayout
            tree={source.pageTree}
            {...baseOptions}
            nav={{
                title: (
                    <span className="inline-block pb-1 text-[1.1rem] font-bold tracking-tight text-fd-foreground">
                        Legend State
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
                        icon: <TbHexagonNumber2Filled size={20} />,
                    },
                    {
                        title: 'Version 3',
                        description: 'Beta version',
                        url: version3Url,
                        urls: getVersionTabUrls(source.pageTree, version3Url),
                        icon: <TbHexagonNumber3Filled size={20} />,
                    },
                ],
            }}
        >
            {children}
        </DocsLayout>
    );
}
