import { getFirstDocsPath } from '@/lib/getDocsPath';
import Link from 'next/link';

export function CustomNavbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-[50px] bg-fd-background/80 backdrop-blur-sm flex items-center justify-between px-4 py-3 border-b bg-background">
            <div className="flex items-center gap-2">
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Logo">
                    <circle cx={12} cy={12} r={12} fill="currentColor" />
                </svg>
                <span className="font-semibold">Legend Docs</span>
            </div>

            <div className="flex items-center gap-6">
                <Link href="/" className="text-sm font-medium hover:text-foreground/80 transition-colors">
                    Home
                </Link>
                <Link
                    href={getFirstDocsPath('list')}
                    className="text-sm font-medium hover:text-foreground/80 transition-colors"
                >
                    List
                </Link>
                <Link href="/state" className="text-sm font-medium hover:text-foreground/80 transition-colors">
                    State
                </Link>
                <Link
                    href={getFirstDocsPath('motion')}
                    className="text-sm font-medium hover:text-foreground/80 transition-colors"
                >
                    Motion
                </Link>
                <Link href="/blog" className="text-sm font-medium hover:text-foreground/80 transition-colors">
                    Blog
                </Link>
            </div>
        </nav>
    );
}
