/* eslint-disable @next/next/no-img-element */
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
    nav: {
        title: (
            <>
                <div className="flex items-center gap-2">
                    <img src="/open-source/assets/logo.png" alt="Legend" width={24} height={24} />

                    <span className="font-semibold">Legend Docs</span>
                </div>
            </>
        ),
    },
    links: [
        {
            text: 'Legend',
            url: '/',
            active: 'url',
        },
        {
            text: 'Kit',
            url: '/kit',
            active: 'nested-url',
        },
        {
            text: 'List',
            url: '/list',
            active: 'nested-url',
        },
        {
            text: 'State',
            url: '/state',
            active: 'nested-url',
        },
        {
            text: 'Motion',
            url: '/motion',
            active: 'nested-url',
        },
        {
            text: 'Blog',
            url: '/blog',
            active: 'nested-url',
        },
    ],
};
