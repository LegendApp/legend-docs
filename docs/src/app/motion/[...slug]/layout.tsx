import type { ReactNode } from 'react';
import { LibraryDocsLayout } from '@/components/library-docs-layout';
import { source } from '@/lib/sources/motion';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <LibraryDocsLayout
            tree={source.pageTree}
            title="Legend Motion"
            libraryBase="motion"
            versions={{
                stableVersion: 2,
            }}
        >
            {children}
        </LibraryDocsLayout>
    );
}
