import '@/app/global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

import { Provider } from './provider';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
    metadataBase: new URL('https://legend.so'),
    title: { default: 'Legend — Great apps. Tools to make your own.', template: '%s · Legend' },
    description:
        'Thoughtful apps for your everyday, open-source libraries for your next project, and a framework for building native desktop apps with React.',
    icons: { icon: '/assets/logo.png', apple: '/assets/logo.png' },
};

export default function Layout({ children }: { children: ReactNode }) {
    const gtmId = process.env.GTM_ID || '';
    return (
        <html lang="en" className={inter.className} suppressHydrationWarning>
            <body className="flex flex-col min-h-screen">
                {gtmId && <GoogleAnalytics gaId={gtmId} />}
                <Provider>{children}</Provider>
            </body>
        </html>
    );
}
