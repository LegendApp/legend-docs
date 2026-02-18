/* eslint-disable @next/next/no-img-element */
'use client';

import { SidebarTrigger, useSidebar } from 'fumadocs-ui/components/sidebar/base';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFirstDocsPath } from '@/lib/getDocsPath';
import Link from 'fumadocs-core/link';
import { baseOptions } from '@/app/layout.config';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { PanelLeft, Search } from 'lucide-react';

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

function MobileSearchToggle({ className }: { className?: string }) {
    const { setOpenSearch, enabled } = useSearchContext();

    if (!enabled) return null;

    return (
        <button
            type="button"
            data-search=""
            aria-label="Open Search"
            className={classNames(
                buttonVariants({
                    color: 'ghost',
                    size: 'icon-sm',
                }),
                className,
            )}
            onClick={() => setOpenSearch(true)}
        >
            <Search className="size-4.5" />
        </button>
    );
}

function OptionalSidebarTrigger() {
    let hasSidebarContext = true;

    try {
        useSidebar();
    } catch {
        hasSidebarContext = false;
    }

    if (!hasSidebarContext) return null;

    return (
        <SidebarTrigger
            className={classNames(
                buttonVariants({
                    color: 'ghost',
                    size: 'icon-sm',
                    className: 'p-2',
                }),
            )}
        >
            <PanelLeft className="size-4.5" />
        </SidebarTrigger>
    );
}

export function CustomNavbar() {
    const pathname = usePathname();
    const currentPath = normalizePath(pathname);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const searchToggleConfig = baseOptions.searchToggle;

    const searchToggleNode = searchToggleConfig?.components?.sm ?? <MobileSearchToggle className="p-2" />;

    const navItems = [
        {
            label: 'Legend',
            href: '~/',
            matches: ['/'],
        },
        {
            label: 'Kit',
            href: '~/kit',
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

    useEffect(() => {
        setIsMenuOpen(false);
    }, [currentPath]);

    const renderNavLink = (label: string, href: string, matches: string[], isCompact = false) => {
        const isActive = isPathActive(currentPath, matches);

        const Component = href.startsWith('~') ? 'a' : Link;

        return (
            <Component
                key={label}
                href={href.replace('~', '')}
                className={classNames(
                    'font-medium transition-colors',
                    isCompact && 'rounded px-3 py-2',
                    isActive ? 'text-blue-400 hover:text-blue-300' : 'text-foreground/70 hover:text-foreground/90',
                )}
                onClick={() => {
                    if (isCompact) {
                        setIsMenuOpen(false);
                    }
                }}
            >
                {label}
            </Component>
        );
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 h-[50px] bg-fd-background/20 backdrop-blur-sm flex items-center justify-between pl-4 pr-3 py-3 border-b">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/open-source/assets/logo.png" alt="Legend" width={24} height={24} />

                    <span className="font-semibold hidden md:block">Legend Open Source</span>
                    <span className="font-semibold md:hidden">Legend Docs</span>
                </Link>

                <div className="flex items-center md:hidden">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent p-2 text-foreground/70 hover:text-foreground/90 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle navigation menu"
                        onClick={() => setIsMenuOpen((value) => !value)}
                    >
                        {isMenuOpen ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={20}
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M18 6 6 18M6 6l12 12"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={20}
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M4 7h16M4 12h16M4 17h16"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    strokeLinecap="round"
                                />
                            </svg>
                        )}
                    </button>
                    {searchToggleConfig?.enabled !== false ? searchToggleNode : null}

                    <OptionalSidebarTrigger />
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm pr-1">
                    {navItems.map(({ label, href, matches }) => renderNavLink(label, href, matches))}
                </div>
            </nav>
            {isMenuOpen ? (
                <div className="absolute top-[50px] right-4 mt-2 w-48 rounded-md border border-border z-10 md:hidden bg-fd-background/60 backdrop-blur-lg">
                    <div className="flex flex-col p-2 text-md">
                        {navItems.map(({ label, href, matches }) => renderNavLink(label, href, matches, true))}
                    </div>
                </div>
            ) : null}
        </>
    );
}
