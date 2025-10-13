import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/sources/state';
import { CustomNavbar } from '@/components/navbar';
import { TbHexagonNumber2Filled, TbHexagonNumber3Filled } from 'react-icons/tb';
import { getFirstDocsPath } from '@/lib/getDocsPath';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <DocsLayout
            tree={source.pageTree}
            {...baseOptions}
            nav={{ component: <CustomNavbar />, title: 'Legend State' }}
            sidebar={{
                defaultOpenLevel: 1,
                tabs: [
                    {
                        title: 'Version 2',
                        description: 'Current stable version',
                        url: getFirstDocsPath('state2'),
                        icon: <TbHexagonNumber2Filled size={20} />,
                    },
                    {
                        title: 'Version 3',
                        description: 'Beta version',
                        url: getFirstDocsPath('state'),
                        icon: <TbHexagonNumber3Filled size={20} />,
                    },
                ],
            }}
        >
            {children}
        </DocsLayout>
    );
}
