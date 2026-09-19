import type { ReactNode } from 'react';
import './site.css';
import './home.css';

export default function SiteLayout({ children }: { children: ReactNode }) {
    return <div className="legend-site">{children}</div>;
}
