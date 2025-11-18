'use client';

import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider';
import SearchDialog from '@/components/search';

export function Provider({ children }: { children: ReactNode }) {
    return (
        <RootProvider
            theme={{
                defaultTheme: 'dark',
                forcedTheme: 'dark',
                enableSystem: false,
            }}
            search={{
                SearchDialog,
            }}
        >
            {children}
        </RootProvider>
    );
}
