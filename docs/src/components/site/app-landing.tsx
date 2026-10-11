import Image from 'next/image';
import { ArrowDownToLine } from 'lucide-react';
import { Header } from '@/components/state/home/Header';
import { Text } from '@/components/state/home/Text';
import type { Project } from '@/lib/projects';

export function AppLanding({ project }: { project: Project }) {
    const { download, image, details } = project.homepage!;
    return (
        <main id="main" className="bg-[#0d1117] pb-24 text-white">
            <section className="mx-auto max-w-5xl px-4 pt-28">
                <div className="flex items-center gap-3 text-sm font-medium text-white/60">
                    <span className="rounded-md border border-amber-300/40 bg-amber-300/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-200">
                        Early MVP
                    </span>
                    <span>macOS</span>
                </div>
                <Header size="h1" className="!leading-tight mt-4">{project.name}</Header>
                <Text className="max-w-2xl pt-2 pb-6 md:text-lg">{project.description}</Text>
                {download ? (
                    <div className="flex flex-wrap items-center gap-4">
                        <a href={download} className="flex h-10 items-center gap-2 rounded-lg bg-sky-700/80 px-4 font-bold text-white no-underline shadow transition-colors hover:bg-sky-600">
                            Download for macOS <ArrowDownToLine size={16} aria-hidden="true" />
                        </a>
                        <span className="text-sm text-white/50">From GitHub Releases</span>
                    </div>
                ) : (
                    <span className="inline-flex h-10 items-center rounded-lg border border-white/10 bg-black/30 px-4 font-medium text-white/80">
                        Coming soon
                    </span>
                )}
            </section>
            {image && (
                <figure className="mx-auto mt-14 max-w-6xl px-4">
                    <div className="overflow-hidden rounded-xl bg-black/40 ring-1 ring-white/10 shadow-2xl">
                        <Image
                            src={image}
                            alt={`${project.name} window`}
                            width={1440}
                            height={900}
                            className="mx-auto h-auto max-h-[720px] w-auto max-w-full"
                            sizes="(max-width: 1152px) 100vw, 1120px"
                            priority
                        />
                    </div>
                </figure>
            )}
            <section className="mx-auto mt-section max-w-5xl px-4">
                <Header size="h2">What it does today</Header>
                <dl className="mt-6 divide-y divide-white/10 border-y border-white/10">
                    {details.map(({ label, text }) => (
                        <div key={label} className="grid gap-1 py-5 md:grid-cols-[9rem_1fr] md:gap-8">
                            <dt className="font-mono text-sm text-sky-300 md:pt-1">{label}</dt>
                            <dd><Text className="md:text-lg">{text}</Text></dd>
                        </div>
                    ))}
                </dl>
            </section>
        </main>
    );
}
