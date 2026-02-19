import { LibraryDocsLayout } from '@/components/library-docs-layout';
import { source } from '@/lib/sources/list';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <LibraryDocsLayout
            tree={source.pageTree}
            title="Legend List"
            libraryBase="list"
            versions={{
                stableVersion: 2,
                betaVersion: 3,
            }}
        >
            {children}
        </LibraryDocsLayout>
    );
}
