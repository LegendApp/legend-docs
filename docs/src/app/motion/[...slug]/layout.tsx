import type { ReactNode } from 'react';
import { LibraryDocsLayout } from '@/components/library-docs-layout';
import { source } from '@/lib/sources/motion';
import { TbHexagonNumber1Filled } from 'react-icons/tb';
import { getVersionTabUrls } from '@/lib/getVersionTabUrls';

export default function Layout({ children }: { children: ReactNode }) {
    const version2Url = '/motion/v2';

    return (
        <LibraryDocsLayout
            tree={source.pageTree}
            title="Legend Motion"
            tabs={[
                {
                    title: 'Version 2',
                    description: 'Current stable version',
                    url: version2Url,
                    urls: getVersionTabUrls(source.pageTree, version2Url),
                    icon: <TbHexagonNumber1Filled size={20} />,
                },
            ]}
        >
            {children}
        </LibraryDocsLayout>
    );
}
