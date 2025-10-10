/* eslint-disable @next/next/no-img-element */
'use client';

import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { getFirstDocsPath } from '@/lib/getDocsPath';
import Image from 'next/image';
import Link from 'fumadocs-core/link';

function normalizePath(value?: string | null) {
    if (!value) {
        return '/';
    }

    if (value.length > 1 && value.endsWith('/')) {
        return value.slice(0, -1);
    }

    return value;
}

function isPathActive(currentPath: string, matches: string[]) {
    return matches.some((match) => {
        const target = normalizePath(match);

        if (target === '/') {
            return currentPath === '/';
        }

        return currentPath === target || currentPath.startsWith(`${target}/`);
    });
}

export function CustomNavbar() {
    const pathname = usePathname();
    const currentPath = normalizePath(pathname);

    const navItems = [
        {
            label: 'Legend',
            href: '/',
            matches: ['/'],
        },
        {
            label: 'Kit',
            href: '/kit',
            matches: ['/kit'],
        },
        {
            label: 'List',
            href: getFirstDocsPath('list'),
            matches: ['/list'],
        },
        {
            label: 'State',
            href: '/state',
            matches: ['/state'],
        },
        {
            label: 'Motion',
            href: getFirstDocsPath('motion'),
            matches: ['/motion'],
        },
        {
            label: 'Blog',
            href: '/blog',
            matches: ['/blog'],
        },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-[50px] bg-fd-background/20 backdrop-blur-sm flex items-center justify-between px-4 py-3 border-b bg-background">
            <Link href="/" className="flex items-center gap-2">
                <img src="/open-source/assets/logo.png" alt="Legend" width={24} height={24} />

                <span className="font-semibold">Legend Open Source</span>
            </Link>

            <div className="flex items-center gap-8">
                {navItems.map(({ label, href, matches }) => {
                    const isActive = isPathActive(currentPath, matches);

                    return (
                        <Link
                            key={label}
                            href={href}
                            className={classNames(
                                'text-sm font-medium transition-colors',
                                isActive
                                    ? 'text-blue-400 hover:text-blue-300'
                                    : 'text-foreground/70 hover:text-foreground/90',
                            )}
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
