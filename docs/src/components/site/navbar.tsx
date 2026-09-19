'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Github, Menu, Search, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { usePathname } from 'next/navigation';
import { navigation } from '@/lib/navigation';

export function SearchButton({ expanded = false }: { expanded?: boolean }) {
    const { setOpenSearch } = useSearchContext();
    return (
        <button
            type="button"
            className={expanded ? 'sidebar-search' : 'icon-button'}
            aria-label="Search Legend"
            onClick={() => setOpenSearch(true)}
        >
            <Search size={17} aria-hidden="true" />
            {expanded && (
                <>
                    <span>Search Legend</span>
                    <kbd>⌘ K</kbd>
                </>
            )}
        </button>
    );
}

export function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const menuButton = useRef<HTMLButtonElement>(null);
    return (
        <header className="site-header">
            <a className="skip-link" href="#main">
                Skip to content
            </a>
            <nav
                className="nav-inner"
                aria-label="Main navigation"
                onKeyDown={(event) => {
                    if (open && event.key === 'Escape') {
                        setOpen(false);
                        menuButton.current?.focus();
                    }
                }}
            >
                <Link href="/" className="brand" aria-label="Legend home">
                    <Image src="/assets/logo.png" alt="" width={26} height={26} />
                    <span>Legend</span>
                </Link>
                <div className="desktop-nav">
                    {navigation.map(({ title, url }) => (
                        <Link
                            href={url}
                            key={title}
                            aria-current={pathname.replace(/\/$/, '') === url ? 'page' : undefined}
                        >
                            {title}
                        </Link>
                    ))}
                </div>
                <div className="nav-actions">
                    <SearchButton />
                    <span className="nav-divider" />
                    <a className="icon-button" href="https://github.com/LegendApp" aria-label="Legend on GitHub">
                        <Github size={18} />
                    </a>
                    <button
                        ref={menuButton}
                        type="button"
                        className="icon-button mobile-toggle"
                        aria-label={open ? 'Close navigation' : 'Open navigation'}
                        aria-expanded={open}
                        aria-controls={open ? 'mobile-navigation' : undefined}
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                {open && (
                    <div id="mobile-navigation" className="mobile-nav">
                        {navigation.map(({ title, url }) => (
                            <Link
                                key={title}
                                href={url}
                                aria-current={pathname.replace(/\/$/, '') === url ? 'page' : undefined}
                                onClick={() => setOpen(false)}
                            >
                                {title}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>
        </header>
    );
}
