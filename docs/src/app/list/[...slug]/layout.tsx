import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/sources/list';
import { CustomNavbar } from '@/components/navbar';
import { TbHexagonNumber1Filled, TbHexagonNumber2Filled } from 'react-icons/tb';
import { getFirstDocsPath } from '@/lib/getDocsPath';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <DocsLayout
            tree={source.pageTree}
            {...baseOptions}
            nav={{ component: <CustomNavbar /> }}
            sidebar={{
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
        >
            {children}
        </DocsLayout>
    );
}
