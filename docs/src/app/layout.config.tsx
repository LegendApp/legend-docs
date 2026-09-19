/* eslint-disable @next/next/no-img-element */
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { navigation } from '@/lib/navigation';

export const baseOptions: BaseLayoutProps = {
    nav: {
        title: (
            <div className="flex items-center gap-2">
                <img src="/assets/logo.png" alt="" width={24} height={24} />
                <span className="font-semibold">Legend</span>
            </div>
        ),
    },
    links: [
        { text: 'Home', url: '/', active: 'url' },
        ...navigation.map(({ title, url }) => ({ text: title, url, active: 'nested-url' as const })),
        { text: 'Blog', url: '/blog', active: 'nested-url' },
    ],
};
