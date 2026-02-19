import type { ReactNode } from 'react';
import { LibraryDocsLayout } from '@/components/library-docs-layout';
import { source } from '@/lib/sources/state';
import { TbHexagonNumber2Filled, TbHexagonNumber3Filled } from 'react-icons/tb';
import { getFirstDocsPath } from '@/lib/getDocsPath';
import { getVersionTabUrls } from '@/lib/getVersionTabUrls';

export default function Layout({ children }: { children: ReactNode }) {
    const version2Url = getFirstDocsPath('state2');
    const version3Url = getFirstDocsPath('state');

    return (
        <LibraryDocsLayout
            tree={source.pageTree}
            title="Legend State"
            tabs={[
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
            ]}
        >
            {children}
        </LibraryDocsLayout>
    );
}
