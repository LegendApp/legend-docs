import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/sources/state';
import { CustomNavbar } from '@/components/navbar';

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
                        description: 'Current stable version',
                        url: '/state/docs/v1',
                    },
                    {
                        title: 'Version 2',
                        description: 'Next version',
                        url: '/state/docs/v2',
                    },
                ],
            }}
        >
            {children}
        </DocsLayout>
    );
}
