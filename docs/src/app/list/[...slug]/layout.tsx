import { baseOptions } from '@/app/layout.config';
import { CustomNavbar } from '@/components/navbar';
import { getFirstDocsPath } from '@/lib/getDocsPath';
import { source } from '@/lib/sources/list';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { cn } from 'fumadocs-ui/utils/cn';
import type { ReactNode } from 'react';
import { TbHexagonNumber1Filled, TbHexagonNumber2Filled } from 'react-icons/tb';

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
                        description: 'first version',
                        url: getFirstDocsPath('list1'),
                        icon: <TbHexagonNumber1Filled size={20} />,
                    },
                    {
                        title: 'Version 2',
                        description: 'Current stable version',
                        url: getFirstDocsPath('list'),
                        icon: <TbHexagonNumber2Filled size={20} />,
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
