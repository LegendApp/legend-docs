import type { ReactNode } from 'react';
import { LibraryDocsLayout } from '@/components/library-docs-layout';
import { source } from '@/lib/sources/state';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <LibraryDocsLayout
            tree={source.pageTree}
            title="Legend State"
            libraryBase="state"
            versions={{
                stableVersion: 2,
                betaVersion: 3,
            }}
        >
            {children}
        </LibraryDocsLayout>
    );
}
