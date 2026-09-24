import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Blocks } from 'lucide-react';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { ProjectIcon } from '@/components/site/project-icon';
import { apps, demos, libraries, type Project } from '@/lib/projects';

export const metadata: Metadata = {
    title: { absolute: 'Legend — Apps and tools' },
    description: 'Thoughtful apps, open-source libraries, and a framework for native desktop apps. Made by Legend.',
    alternates: { canonical: '/' },
};

const descriptions: Record<string, string> = {
    diff: 'Review code and resolve conflicts.',
    markdown: 'Your words, in plain Markdown files.',
    music: 'A home for the music you own.',
    slides: 'Turn Markdown and React into presentations.',
    list: 'Fast, flexible lists for React and React Native.',
    state: 'Reactive state, persistence, and sync.',
    motion: 'Simple animations for React Native.',
    code: 'A native code editor prototype.',
    'chat-history': 'Browse your local AI conversations.',
};

function ProductCard({ project }: { project: Project }) {
    return (
        <Link href={`/${project.slug}`} className={`showcase-card showcase-${project.slug}`}>
            <div className={`product-image${project.category === 'library' ? ' docs-image' : ''}`}>
                <Image
                    src={`/assets/showcase/${project.category === 'library' ? `${project.slug}-docs` : project.slug === 'music' ? 'music-main' : project.slug}.png`}
                    alt={project.category === 'library' ? `${project.name} documentation example` : `${project.name} interface`}
                    width={project.slug === 'music' ? 510 : project.category === 'library' ? 1460 : 1440}
                    height={project.slug === 'music' ? 679 : project.category === 'library' ? 768 : 900}
                    sizes="(max-width: 700px) 100vw, 560px"
                />
                {project.slug === 'markdown' && <span className="coming-soon-banner">Coming soon</span>}
            </div>
            <div className="product-caption">
                <ProjectIcon slug={project.slug} size={21} />
                <div>
                    <h3>{project.name}</h3>
                    <p>{descriptions[project.slug]}</p>
                </div>
                <ArrowUpRight size={18} />
            </div>
        </Link>
    );
}

export default function HomePage() {
    return (
        <>
            <Navbar />
            <main id="main" className="showcase-home">
                <header className="showcase-hero">
                    <Image
                        className="hero-art"
                        src="/assets/showcase/legend-hero-blue-metal.png"
                        alt=""
                        width={1942}
                        height={809}
                        priority
                        sizes="100vw"
                    />
                    <div className="showcase-hero-copy">
                        <h1>
                            Fast AF.
                            <span>RN libraries, a desktop framework, apps.</span>
                        </h1>
                        <a href="#libraries">
                            Explore Legend <ArrowDown size={16} />
                        </a>
                    </div>
                </header>

                <section id="libraries" className="showcase-section" aria-labelledby="libraries-title">
                    <div className="showcase-section-heading">
                        <h2 id="libraries-title">Open-source libraries</h2>
                    </div>
                    <div className="showcase-grid showcase-library-grid">
                        {libraries.map((project) => (
                            <ProductCard key={project.slug} project={project} />
                        ))}
                    </div>
                </section>

                <section id="framework" className="showcase-section" aria-labelledby="framework-title">
                    <div className="showcase-section-heading">
                        <h2 id="framework-title">Framework</h2>
                    </div>
                    <Link href="/spark" className="framework-spotlight">
                        <div className="showcase-framework-copy">
                            <Blocks size={28} strokeWidth={1.4} />
                            <span className="showcase-preview-label">Experimental — not for production</span>
                            <h3>Legend Spark</h3>
                            <p>
                                Build native desktop apps with React.
                                <br />
                                Starting on macOS.
                            </p>
                            <span className="showcase-text-link">
                                Explore the framework <ArrowUpRight size={16} />
                            </span>
                        </div>
                        <div className="framework-visual" aria-hidden="true">
                            <div className="framework-stack">
                                <span>React + TypeScript</span>
                                <span>Legend Spark</span>
                                <div>
                                    <span>Windows</span>
                                    <span>Menus</span>
                                    <span>Files</span>
                                </div>
                                <span>Native desktop apps</span>
                            </div>
                        </div>
                    </Link>
                </section>

                <section id="apps" className="showcase-section" aria-labelledby="apps-title">
                    <div className="showcase-section-heading">
                        <h2 id="apps-title">Apps</h2>
                    </div>
                    <a className="legend-spotlight" href="https://legendapp.com/">
                        <div className="legend-spotlight-copy">
                            <Image src="/assets/logo.png" alt="" width={42} height={42} />
                            <h3>Legend</h3>
                            <p>Your notes, tasks, and projects. Together.</p>
                            <span>
                                Explore Legend <ArrowUpRight size={16} />
                            </span>
                        </div>
                        <div className="legend-spotlight-image">
                            <Image
                                src="/assets/showcase/legend.png"
                                alt="Legend brings notes, tasks, and calendars into one workspace"
                                width={1440}
                                height={900}
                                sizes="(max-width: 700px) 100vw, 780px"
                            />
                        </div>
                    </a>
                    <div className="showcase-grid">
                        {apps.map((project) => (
                            <ProductCard key={project.slug} project={project} />
                        ))}
                    </div>
                </section>

                <section id="demos" className="showcase-section" aria-labelledby="demos-title">
                    <div className="showcase-section-heading">
                        <h2 id="demos-title">Demo Apps</h2>
                    </div>
                    <div className="showcase-grid">
                        {demos
                            .filter((project) => project.slug === 'code' || project.slug === 'chat-history')
                            .map((project) => (
                                <ProductCard key={project.slug} project={project} />
                            ))}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
