import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowDownToLine, ArrowRight, ArrowUpRight, Presentation } from 'lucide-react';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { ProjectIcon } from '@/components/site/project-icon';
import { AppIcon, looks } from '@/components/site/app-landing';
import { heroCode, highlight } from '@/components/site/framework-landing';
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
    photos: 'Browse folders and Apple Photos albums.',
    slides: 'Turn Markdown and React into presentations.',
    list: 'Fast, flexible lists for React and React Native.',
    state: 'Reactive state, persistence, and sync.',
    motion: 'Simple animations for React Native.',
    code: 'A full code editor for any text file.',
    'chat-history': 'Browse your local AI conversations.',
};

// Import paths exported by @legendapp/spark.
const sparkApis = [
    'windows',
    'menus',
    'context-menu',
    'shortcuts',
    'global-shortcuts',
    'dialogs',
    'files',
    'settings',
    'secure-storage',
    'clipboard',
    'drag-drop',
    'notifications',
    'tray',
    'sqlite',
    'webview',
    'updates',
];

const sparkRuntimes = [
    {
        title: 'Spark Runner',
        text: 'A prebuilt development app. Run your project without compiling native code; edits use Fast Refresh.',
    },
    {
        title: 'Custom development build',
        text: 'Add native modules or app-specific native configuration. JavaScript still reloads with Fast Refresh.',
    },
    {
        title: 'Standalone app',
        text: 'A .app with embedded JavaScript that runs without Metro. Sign and notarize it with your Developer ID.',
    },
];

function SectionHeading({ id, title, text }: { id: string; title: string; text: string }) {
    return (
        <div className="mb-10 md:mb-12">
            <h2 id={id} className="scroll-mt-24 text-[32px] font-bold leading-tight tracking-[-0.025em] text-white md:text-[40px]">
                {title}
            </h2>
            <p className="mt-2 text-[15px] text-[#999ca3] md:text-base">{text}</p>
        </div>
    );
}

function LibraryCard({ project }: { project: Project }) {
    return (
        <Link href={`/${project.slug}`} className="group block min-w-0 no-underline">
            <div className={`showcase-${project.slug} overflow-hidden rounded-2xl border border-white/10 transition-colors group-hover:border-white/25`}>
                <div className="docs-image relative aspect-[1.3] overflow-hidden">
                    <Image
                        src={`/assets/showcase/${project.slug}-docs.png`}
                        alt={`${project.name} documentation example`}
                        width={1460}
                        height={768}
                        sizes="(max-width: 768px) 100vw, 380px"
                    />
                </div>
            </div>
            <div className="mt-5 flex items-start gap-3">
                <span className="mt-0.5 text-[#8bb1c9]">
                    <ProjectIcon slug={project.slug} size={20} />
                </span>
                <div className="min-w-0">
                    <h3 className="text-[17px] font-semibold text-white">{project.name}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-[#999ca3]">{descriptions[project.slug]}</p>
                    <code className="mt-2 inline-block text-[12px] text-white/45">{project.package}</code>
                </div>
                <ArrowUpRight size={18} className="ml-auto mt-0.5 shrink-0 text-white/30 transition-colors group-hover:text-white/70" />
            </div>
        </Link>
    );
}

function AppPreview({ project }: { project: Project }) {
    const look = looks[project.slug];
    const window = look?.window;
    const accent = look?.accent ?? '#6a7cff';
    return (
        <div className="relative aspect-[1.55] overflow-hidden rounded-2xl border border-white/10 bg-[#141517] transition-colors group-hover:border-white/25">
            <div
                aria-hidden="true"
                className="absolute inset-0 opacity-30"
                style={{ background: `radial-gradient(60% 70% at 50% 100%, ${accent}, transparent 75%)` }}
            />
            {window || project.slug === 'slides' ? (
                <div
                    className="absolute inset-x-[7%] top-[9%] overflow-hidden rounded-[8px] shadow-[0_0_0_1px_#ffffff1f,0_30px_60px_-20px_#000] transition-transform duration-300 group-hover:-translate-y-1"
                    style={{ background: window?.bar ?? '#1b1b1d' }}
                >
                    {/* The Slides screenshot already includes its title bar. */}
                    {window && (
                        <div className="flex h-5 items-center gap-1.5 px-2.5" aria-hidden="true">
                            <span className="size-2 rounded-full bg-[#ff5f57]" />
                            <span className="size-2 rounded-full bg-[#febc2e]" />
                            <span className="size-2 rounded-full bg-[#28c840]" />
                        </div>
                    )}
                    <Image
                        src={window ? project.homepage!.image! : '/assets/showcase/slides.png'}
                        alt={`${project.name} window`}
                        width={window?.width ?? 1440}
                        height={window?.height ?? 900}
                        className="block h-auto w-full"
                        sizes="(max-width: 768px) 90vw, 480px"
                    />
                </div>
            ) : (
                <>
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-[0.07]"
                        style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '22px 22px' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <AppIcon
                            project={project}
                            size={144}
                            priority={false}
                            className="size-28 transition-transform duration-300 group-hover:-translate-y-1 md:size-36"
                        />
                    </div>
                </>
            )}
        </div>
    );
}

function AppCard({ project }: { project: Project }) {
    const download = project.homepage?.download;
    return (
        <article className="group relative min-w-0">
            <AppPreview project={project} />
            <div className="mt-5 flex items-center gap-3.5">
                {project.slug === 'slides' ? (
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-[22.5%] bg-[#25232c] text-white/80 shadow-[0_1px_0_#ffffff26_inset]">
                        <Presentation size={22} strokeWidth={1.6} aria-hidden="true" />
                    </span>
                ) : (
                    <AppIcon project={project} size={44} priority={false} className="size-11 shrink-0" />
                )}
                <div className="min-w-0">
                    <h3 className="text-[17px] font-semibold text-white">
                        <Link href={`/${project.slug}`} className="text-white no-underline after:absolute after:inset-0">
                            {project.name}
                        </Link>
                    </h3>
                    <p className="mt-0.5 text-[14px] text-[#999ca3]">{descriptions[project.slug]}</p>
                </div>
                {download ? (
                    <a
                        href={download}
                        className="relative z-10 ml-auto inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-3.5 text-[13px] font-medium text-white/85 no-underline transition-colors hover:bg-white/[0.12] hover:text-white"
                    >
                        <ArrowDownToLine size={14} aria-hidden="true" /> Download
                    </a>
                ) : project.homepage ? (
                    <span className="ml-auto shrink-0 rounded-full border border-white/10 px-3.5 py-1.5 text-[13px] text-white/55">
                        Coming soon
                    </span>
                ) : null}
            </div>
        </article>
    );
}

function Spark() {
    return (
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111214]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.14]"
                style={{ background: 'radial-gradient(50% 60% at 85% 20%, #2f8cff, transparent 70%)' }}
            />
            <div className="relative grid gap-12 p-6 md:p-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Image src="/assets/legend-spark.png" alt="" width={44} height={44} className="rounded-[10px]" />
                        <span className="text-[17px] font-semibold text-white">Legend Spark</span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/50 bg-amber-300/[0.12] px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-amber-200">
                            <span className="size-1.5 rounded-full bg-amber-300" />
                            Experimental
                        </span>
                    </div>
                    <h3 className="mt-8 text-[34px] font-bold leading-[1.08] tracking-[-0.03em] text-white md:text-[44px]">
                        React Native, meet the desktop.
                    </h3>
                    <p className="mt-5 max-w-[480px] text-base leading-relaxed text-[#b4b7bd] md:text-[17px]">
                        Build native Mac apps with React Native and Expo Desktop. Screens use React Native&apos;s native
                        renderer, JavaScript runs in Hermes, and one package brings real windows, menus, dialogs, and files.
                    </p>
                    <div className="mt-8">
                        <code className="text-[13px] text-white/80">@legendapp/spark/…</code>
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                            {sparkApis.map((api) => (
                                <li
                                    key={api}
                                    className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[12px] text-[#b4b7bd]"
                                >
                                    {api}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-9 flex flex-wrap items-center gap-3">
                        <Link
                            href="/spark"
                            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0076ac] px-6 text-[15px] font-semibold text-white no-underline transition-colors hover:bg-[#006a9b]"
                        >
                            Explore Spark <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                        <a
                            href="https://github.com/LegendApp/legend-spark"
                            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-6 text-[15px] font-medium text-white/85 no-underline transition-colors hover:bg-white/[0.1]"
                        >
                            GitHub <ArrowUpRight size={16} aria-hidden="true" />
                        </a>
                    </div>
                </div>
                <figure className="!m-0 min-w-0 self-center">
                    <div className="overflow-hidden rounded-xl bg-[#16181b] shadow-[0_0_0_1px_#ffffff1f,0_40px_80px_-24px_#000]">
                        <div className="flex h-9 items-center gap-2 border-b border-white/[0.06] px-4">
                            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                            <span className="size-2.5 rounded-full bg-[#febc2e]" />
                            <span className="size-2.5 rounded-full bg-[#28c840]" />
                            <span className="ml-3 font-mono text-[11px] text-white/40">App.tsx</span>
                        </div>
                        <pre className="!m-0 overflow-x-auto !bg-transparent px-4 py-4 text-[11px] leading-[1.7] md:px-5 md:text-[12.5px] text-[#c9d3dd]">
                            <code>{highlight(heroCode)}</code>
                        </pre>
                    </div>
                    <figcaption className="mt-3 text-[13px] text-[#999ca3]">
                        A native menu item that opens a second window rendering a React Native root.
                    </figcaption>
                </figure>
            </div>
            <ol className="relative grid border-t border-white/10 md:grid-cols-3">
                {sparkRuntimes.map(({ title, text }, i) => (
                    <li key={title} className="border-white/10 p-6 max-md:border-t max-md:first:border-t-0 md:border-l md:p-8 md:first:border-l-0 md:px-12">
                        <span className="font-mono text-[12px] text-white/35">0{i + 1}</span>
                        <h4 className="mt-2 text-[15px] font-semibold text-white">{title}</h4>
                        <p className="mt-1.5 text-[14px] leading-relaxed text-[#999ca3]">{text}</p>
                    </li>
                ))}
            </ol>
            <p className="relative border-t border-white/10 px-6 py-4 text-[13px] text-[#999ca3] md:px-12">
                Not ready for production. macOS 14+ on Apple Silicon is the primary target, built on Expo SDK 54 and React
                Native 0.81. Intel and Windows builds still need validation.
            </p>
        </div>
    );
}

export default function HomePage() {
    return (
        <>
            <Navbar />
            <main id="main" className="showcase-home pb-28">
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

                <section aria-labelledby="libraries">
                    <SectionHeading id="libraries" title="Open-source libraries" text="For React and React Native, on npm." />
                    <div className="grid gap-10 md:grid-cols-3 md:gap-6">
                        {libraries.map((project) => (
                            <LibraryCard key={project.slug} project={project} />
                        ))}
                    </div>
                </section>

                <section className="mt-28 md:mt-36" aria-labelledby="framework">
                    <SectionHeading id="framework" title="Spark" text="A framework for native desktop apps in React Native." />
                    <Spark />
                </section>

                <section className="mt-28 md:mt-36" aria-labelledby="apps">
                    <SectionHeading id="apps" title="Apps" text="Made by Legend." />
                    <a
                        className="group mb-12 grid overflow-hidden rounded-[28px] border border-white/10 bg-[#101c24] no-underline transition-colors hover:border-white/25 md:grid-cols-[1fr_2fr]"
                        href="https://legendapp.com/"
                    >
                        <div className="self-center p-8 md:p-10">
                            <Image src="/assets/logo.png" alt="" width={48} height={48} className="rounded-[22.5%]" />
                            <h3 className="mt-6 text-[28px] font-bold tracking-[-0.025em] text-white">Legend</h3>
                            <p className="mt-2 text-[17px] leading-relaxed text-[#b0bfcb]">Your notes, tasks, and projects. Together.</p>
                            <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-[#86c9f4]">
                                legendapp.com <ArrowUpRight size={16} aria-hidden="true" />
                            </span>
                        </div>
                        <div className="ml-8 mt-0 h-[230px] overflow-hidden rounded-tl-[10px] border-l border-t border-white/15 md:ml-0 md:mt-10 md:h-auto">
                            <Image
                                src="/assets/showcase/legend.png"
                                alt="Legend brings notes, tasks, and calendars into one workspace"
                                width={1440}
                                height={900}
                                className="h-full w-full object-cover object-left-top"
                                sizes="(max-width: 768px) 100vw, 740px"
                            />
                        </div>
                    </a>
                    <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
                        {apps.map((project) => (
                            <AppCard key={project.slug} project={project} />
                        ))}
                    </div>
                </section>

                <section className="mt-28 md:mt-36" aria-labelledby="demos">
                    <SectionHeading id="demos" title="Demo apps" text="Small, focused apps to download and try." />
                    <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
                        {demos.map((project) => (
                            <AppCard key={project.slug} project={project} />
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
