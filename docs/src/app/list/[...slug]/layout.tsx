import { baseOptions } from '@/app/layout.config';
import { CustomNavbar } from '@/components/navbar';
import { getFirstDocsPath } from '@/lib/getDocsPath';
import { source } from '@/lib/sources/list';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { cn } from 'fumadocs-ui/utils/cn';
import type { ReactNode } from 'react';
import { TbHexagonNumber1Filled, TbHexagonNumber2Filled, TbHexagonNumber3Filled } from 'react-icons/tb';

export default function Layout({ children }: { children: ReactNode }) {
    const sidebarEnabled = true;

    return (
        <DocsLayout
            tree={source.pageTree}
            {...baseOptions}
            nav={{
                component: <CustomNavbar />,
                title: 'Legend List',
            }}
            sidebar={{
                enabled: sidebarEnabled,
                defaultOpenLevel: 1,
                tabs: [
                    {
                        title: 'Version 1',
                        description: 'Legacy version',
                        url: getFirstDocsPath('list1'),
                        icon: <TbHexagonNumber1Filled size={20} />,
                    },
                    {
                        title: 'Version 2',
                        description: 'Stable version',
                        url: getFirstDocsPath('list2'),
                        icon: <TbHexagonNumber2Filled size={20} />,
                    },
                    {
                        title: 'Version 3',
                        description: 'Beta version',
                        url: getFirstDocsPath('list'),
                        icon: <TbHexagonNumber3Filled size={20} />,
                    },
                ],
            }}
            containerProps={{
                className: cn('[--fd-nav-height:106px]', 'md:[--fd-nav-height:50px]'),
            }}
        >
            {children}
        </DocsLayout>
    );
}
