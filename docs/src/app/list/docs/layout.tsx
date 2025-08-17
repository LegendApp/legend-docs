import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/sources/list';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions}
      sidebar={{
        tabs: [
          {
            title: 'Version 1',
            description: 'Current stable version',
            url: '/list/docs/v1'
          },
          {
            title: 'Version 2',
            description: 'Next version',
            url: '/list/docs/v2'
          }
        ]
      }}
    >
      {children}
    </DocsLayout>
  );
}