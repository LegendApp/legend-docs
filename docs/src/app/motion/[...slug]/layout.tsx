import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/sources/motion';
import { CustomNavbar } from '@/components/navbar';
import { TbHexagonNumber1Filled } from 'react-icons/tb';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <DocsLayout
            tree={source.pageTree}
            {...baseOptions}
            nav={{ component: <CustomNavbar />, title: 'Legend Motion' }}
            sidebar={{
                defaultOpenLevel: 1,
                tabs: [
                    {
                        title: 'Version 1',
                        description: 'Current stable version',
                        url: '/motion/v1',
                        icon: <TbHexagonNumber1Filled size={20} />,
                    },
                ],
            }}
        >
            {children}
        </DocsLayout>
    );
}
