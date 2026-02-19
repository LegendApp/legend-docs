import { baseOptions } from '@/app/layout.config';
import { getFirstDocsPath } from '@/lib/getDocsPath';
import { getVersionTabUrls } from '@/lib/getVersionTabUrls';
import { source } from '@/lib/sources/list';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { SidebarSearchBanner } from '@/components/sidebar-search-banner';
import type { ReactNode } from 'react';
import { TbHexagonNumber1Filled, TbHexagonNumber2Filled, TbHexagonNumber3Filled } from 'react-icons/tb';

export default function Layout({ children }: { children: ReactNode }) {
    const version1Url = getFirstDocsPath('list1');
    const version2Url = getFirstDocsPath('list2');
    const version3Url = getFirstDocsPath('list');

    return (
        <DocsLayout
            tree={source.pageTree}
            {...baseOptions}
            nav={{
                title: (
                    <span className="inline-block pb-1 text-[1.1rem] font-bold tracking-tight text-fd-foreground">
                        Legend List
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
                        title: 'Version 1',
                        description: 'Legacy version',
                        url: version1Url,
                        urls: getVersionTabUrls(source.pageTree, version1Url),
                        icon: <TbHexagonNumber1Filled size={20} />,
                    },
                    {
                        title: 'Version 2',
                        description: 'Stable version',
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
