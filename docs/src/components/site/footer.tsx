import Link from 'next/link';

export function Footer() {
    return (
        <footer className="simple-footer">
            <Link href="/">Legend</Link>
            <Link href="/blog">Blog</Link>
            <a href="https://github.com/LegendApp">GitHub</a>
        </footer>
    );
}
