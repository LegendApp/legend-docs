import '@/app/global.css';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { GoogleTagManager } from '@next/third-parties/google';

import { Provider } from './provider';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
});

export default function Layout({ children }: { children: ReactNode }) {
    const gtmId = process.env.GTM_ID || '';
    if (!gtmId) {
        console.error('NEXT_PUBLIC_GTM_ID is not set');
    }
    return (
        <html lang="en" className={inter.className} suppressHydrationWarning>
            <body className="flex flex-col min-h-screen">
                {gtmId && <GoogleTagManager gtmId={gtmId} />}
                <Provider>{children}</Provider>
            </body>
        </html>
    );
}
