import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/sources/motion';
import { CustomNavbar } from '@/components/navbar';
import { TbHexagonNumber1Filled } from 'react-icons/tb';
import { getVersionTabUrls } from '@/lib/getVersionTabUrls';

export default function Layout({ children }: { children: ReactNode }) {
    const version2Url = '/motion/v2';

    return (
        <DocsLayout
            tree={source.pageTree}
            {...baseOptions}
            nav={{ component: <CustomNavbar />, title: 'Legend Motion' }}
            sidebar={{
                defaultOpenLevel: 1,
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
