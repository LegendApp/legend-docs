import Image from 'next/image';
import { ArrowDownToLine } from 'lucide-react';
import type { Project } from '@/lib/projects';

// Accent glow per app, plus each window screenshot's size and toolbar color so the title bar blends in.
const looks: Record<string, { accent: string; window?: { width: number; height: number; bar: string } }> = {
    diff: { accent: '#3ecf6e', window: { width: 1276, height: 748, bar: '#212123' } },
    markdown: { accent: '#ffa526', window: { width: 896, height: 696, bar: '#f5f6f8' } },
    code: { accent: '#2bb4e6', window: { width: 1076, height: 756, bar: '#1e1e1e' } },
    'chat-history': { accent: '#6a5cff', window: { width: 1278, height: 718, bar: '#1f1f1f' } },
    music: { accent: '#1d9be8' },
    photos: { accent: '#f28a52' },
};

function AppIcon({ project, size, className = '' }: { project: Project; size: number; className?: string }) {
    return (
        <Image
            src={`/assets/apps/${project.slug}-icon.png`}
            alt={`${project.name} icon`}
            width={size}
            height={size}
            className={`rounded-[22.5%] shadow-[0_1px_0_#ffffff26_inset,0_18px_40px_-12px_#000c] ${className}`}
            priority
        />
    );
}

function Download({ project }: { project: Project }) {
    const { download } = project.homepage!;
    return download ? (
        <div className="flex flex-col items-center gap-3">
            <a
                href={download}
                className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#0076ac] px-7 text-[15px] font-semibold text-white no-underline shadow-[0_8px_24px_-8px_#0099dd99] transition-colors hover:bg-[#006a9b]"
            >
                <ArrowDownToLine size={17} aria-hidden="true" /> Download for macOS
            </a>
            <span className="text-[13px] text-[#999ca3]">From GitHub Releases</span>
        </div>
    ) : (
        <span className="inline-flex h-12 items-center rounded-full border border-white/12 bg-white/[0.04] px-7 text-[15px] font-medium text-white/80">
            Coming soon
        </span>
    );
}

export function AppLanding({ project }: { project: Project }) {
    const { image, details } = project.homepage!;
    const { accent, window } = looks[project.slug];
    return (
        <main id="main" className="relative overflow-hidden bg-[#0d0d0e] pb-28 text-[#f1f1f1]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[900px] opacity-[0.16]"
                style={{ background: `radial-gradient(60% 50% at 50% 35%, ${accent}, transparent 70%)` }}
            />
            <section className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pt-20 text-center md:pt-28">
                <span className="inline-flex items-center gap-2.5 rounded-full border border-amber-300/50 bg-amber-300/[0.12] px-4 py-2 text-sm font-semibold text-amber-200">
                    <span className="size-2 rounded-full bg-amber-300 shadow-[0_0_8px_#fcd34d]" />
                    <span className="uppercase tracking-wider">Early MVP</span>
                    <span className="text-amber-200/50">·</span>
                    <span className="font-medium text-amber-100/70">macOS</span>
                </span>
                {image && <AppIcon project={project} size={104} className="mt-10 size-20 md:size-[104px]" />}
                <h1 className="mt-7 text-[44px] font-bold leading-[1.05] tracking-[-0.035em] text-white md:text-[72px]">{project.name}</h1>
                <p className="mt-4 text-xl font-medium tracking-[-0.01em] text-white/85 md:text-2xl">{project.tagline}</p>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-[#999ca3] md:text-lg">{project.description}</p>
                <div className="mt-9">
                    <Download project={project} />
                </div>
            </section>

            {image && window ? (
                <figure className="relative mx-auto mt-16 max-w-[1120px] px-4 md:mt-20 md:px-8">
                    <div
                        className="overflow-hidden rounded-[10px] shadow-[0_0_0_1px_#ffffff1f,0_40px_100px_-20px_#000,0_20px_50px_-30px_#000] md:rounded-[14px]"
                        style={{ background: window.bar, maxWidth: window.width, margin: '0 auto' }}
                    >
                        <div className="flex h-7 items-center gap-2 px-3.5 md:h-9 md:px-4" aria-hidden="true">
                            <span className="size-2.5 rounded-full bg-[#ff5f57] md:size-3" />
                            <span className="size-2.5 rounded-full bg-[#febc2e] md:size-3" />
                            <span className="size-2.5 rounded-full bg-[#28c840] md:size-3" />
                        </div>
                        <Image
                            src={image}
                            alt={`${project.name} window`}
                            width={window.width}
                            height={window.height}
                            className="block h-auto w-full"
                            sizes="(max-width: 1120px) 100vw, 1056px"
                            priority
                        />
                    </div>
                </figure>
            ) : (
                <div className="relative mx-auto mt-16 max-w-[1056px] px-4 md:mt-20 md:px-8">
                    <div className="relative flex h-[300px] items-center justify-center overflow-hidden rounded-[28px] border border-white/10 bg-[#141517] md:h-[440px]">
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 opacity-40"
                            style={{ background: `radial-gradient(45% 60% at 50% 55%, ${accent}, transparent 75%)` }}
                        />
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 opacity-[0.07]"
                            style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '22px 22px' }}
                        />
                        <AppIcon project={project} size={224} className="relative size-40 md:size-56" />
                    </div>
                </div>
            )}

            <section className="mx-auto mt-24 grid max-w-[1056px] gap-10 px-6 md:mt-32 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
                <div>
                    <h2 className="text-[32px] font-bold leading-tight tracking-[-0.025em] text-white md:text-[40px]">What it does today</h2>
                    <p className="mt-3 text-[#999ca3]">What works in the current early build.</p>
                </div>
                <dl className="border-t border-[#25262a]">
                    {details.map(({ label, text }) => (
                        <div key={label} className="grid gap-1.5 border-b border-[#25262a] py-6 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6">
                            <dt className="text-[15px] font-semibold text-white">{label}</dt>
                            <dd className="text-[15px] leading-relaxed text-[#b4b7bd] md:text-base">{text}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="mx-auto mt-28 flex max-w-3xl flex-col items-center px-6 text-center md:mt-36">
                <AppIcon project={project} size={72} className="size-16 md:size-[72px]" />
                <h2 className="mt-6 text-[28px] font-bold tracking-[-0.025em] text-white md:text-[36px]">{project.name}</h2>
                <p className="mt-2 text-[#999ca3]">{project.tagline}</p>
                <div className="mt-8">
                    <Download project={project} />
                </div>
            </section>
        </main>
    );
}
