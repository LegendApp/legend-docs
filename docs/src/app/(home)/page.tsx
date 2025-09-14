'use client';

import Link from 'next/link';
import { HomePageLayout } from '@/components/HomePageLayout';
import classNames from 'classnames';

interface LibraryCardProps {
    title: string;
    description: string;
    href: string;
    docsHref: string;
    githubHref: string;
}

const BGClassName = 'bg-fd-card border border-fd-border';

function CardButton({ href, children, className }: { href: string; className?: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={classNames(
                'flex-1 flex items-center justify-center gap-2 px-6 py-3 hover:bg-fd-accent text-white transition-colors duration-200',
                className,
            )}
        >
            {children}
        </Link>
    );
}

function LibraryCard({ title, description, docsHref, githubHref }: LibraryCardProps) {
    return (
        <div className={classNames('rounded-lg mb-6 max-w-xl mx-auto', BGClassName)}>
            <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
                <p className="text-fd-muted-foreground">{description}</p>
            </div>

            <div className="flex border-t border-fd-border">
                <CardButton href={docsHref}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    Documentation
                </CardButton>
                <CardButton href={githubHref} className="border-l border-fd-border">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    GitHub
                </CardButton>
            </div>
        </div>
    );
}

export default function HomePage() {
    const libraries: LibraryCardProps[] = [
        {
            title: 'Legend State',
            description: 'Ultra-fast state management with fine-grained reactivity and powerful sync capabilities.',
            href: '/state',
            docsHref: '/state/',
            githubHref: 'https://github.com/LegendApp/legend-state',
        },
        {
            title: 'Legend List',
            description: 'A very fast virtualized list for React and React Native with smooth scrolling.',
            href: '/list',
            docsHref: '/list/v2/intro',
            githubHref: 'https://github.com/LegendApp/legend-list',
        },
        {
            title: 'Legend Motion',
            description: 'Smooth, performant animations with a declarative API for stunning motion experiences.',
            href: '/motion/v1',
            docsHref: '/motion/v1',
            githubHref: 'https://github.com/LegendApp/legend-motion',
        },
    ];

    return (
        <HomePageLayout>
            <div className="min-h-screen bg-fd-background">
                <div className="max-w-4xl mx-auto px-6 py-20">
                    {/* Hero Section */}
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Legend Open Source</h1>
                        <p className="text-fd-muted-foreground max-w-2xl mx-auto">
                            Open-source libraries for building fast AF React applications
                        </p>

                        {/* Blog Section */}
                        <div className="my-12">
                            <Link
                                href="/blog"
                                className={classNames(
                                    'inline-flex items-center gap-3 px-6 py-3 rounded-full text-zinc-300 hover:text-white hover:bg-fd-accent transition-all duration-300',
                                    BGClassName,
                                )}
                            >
                                <span>Read our blog</span>
                                <span className="text-sm">✨</span>
                            </Link>
                        </div>
                    </div>

                    {/* Libraries */}
                    <div>
                        {libraries.map((library) => (
                            <LibraryCard key={library.title} {...library} />
                        ))}
                    </div>
                </div>
            </div>
        </HomePageLayout>
    );
}
