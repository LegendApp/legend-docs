import Link from 'next/link';

export function CustomNavbar() {
    return (
        <nav className="flex items-center justify-between px-4 py-3 border-b bg-background">
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
                <Link href="/list" className="text-sm font-medium hover:text-foreground/80 transition-colors">
                    List
                </Link>
                <Link href="/state" className="text-sm font-medium hover:text-foreground/80 transition-colors">
                    State
                </Link>
            </div>
        </nav>
    );
}
