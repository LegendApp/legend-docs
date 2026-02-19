import { LibraryDocsLayout } from '@/components/library-docs-layout';
import { getFirstDocsPath } from '@/lib/getDocsPath';
import { getVersionTabUrls } from '@/lib/getVersionTabUrls';
import { source } from '@/lib/sources/list';
import type { ReactNode } from 'react';
import { TbHexagonNumber1Filled, TbHexagonNumber2Filled, TbHexagonNumber3Filled } from 'react-icons/tb';

export default function Layout({ children }: { children: ReactNode }) {
    const version1Url = getFirstDocsPath('list1');
    const version2Url = getFirstDocsPath('list2');
    const version3Url = getFirstDocsPath('list');

    return (
        <LibraryDocsLayout
            tree={source.pageTree}
            title="Legend List"
            tabs={[
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
            ]}
        >
            {children}
        </LibraryDocsLayout>
    );
}
