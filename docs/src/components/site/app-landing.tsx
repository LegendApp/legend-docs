import Image from 'next/image';
import { ArrowDownToLine } from 'lucide-react';
import { Header } from '@/components/state/home/Header';
import { Text } from '@/components/state/home/Text';
import { BackgroundGradients } from '@/components/state/home/BackgroundGradients';
import { ProjectIcon } from './project-icon';
import type { Project } from '@/lib/projects';

function Download({ href }: { href?: string }) {
    return href ? (
        <a href={href} className="button button-primary">
            Download for macOS <ArrowDownToLine size={16} aria-hidden="true" />
        </a>
    ) : (
        <span className="status-badge">Coming soon</span>
    );
}

export function AppLanding({ project }: { project: Project }) {
    const homepage = project.homepage!;
    return (
        <main id="main" className="relative isolate overflow-hidden bg-[#0d1117] pb-24 text-white">
            <BackgroundGradients />
            <section className="relative mx-auto max-w-5xl px-6 pt-20 sm:pt-28">
                <div className="mb-8 inline-flex rounded-2xl border border-white/10 bg-sky-700/20 p-4 text-sky-300 shadow-lg">
                    <ProjectIcon slug={project.slug} size={40} />
                </div>
                <Header size="h1" className="!leading-tight tracking-tight">{project.name}</Header>
                <Text className="mt-4 max-w-3xl !text-white text-2xl sm:text-3xl">{project.tagline}</Text>
                <Text className="mt-5 max-w-2xl text-base sm:text-lg">{project.description}</Text>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Download href={homepage.download} />
                    {homepage.download && <span className="text-sm text-white/50">Choose your download on GitHub Releases.</span>}
                </div>
                {homepage.image ? (
                    <figure className="mt-14 overflow-hidden rounded-xl border border-white/10 bg-black/20 shadow-2xl">
                        <Image
                            src={homepage.image}
                            alt={`${project.name} interface`}
                            width={1440}
                            height={900}
                            className="mx-auto h-auto max-h-[640px] w-auto max-w-full"
                            sizes="(max-width: 1024px) 100vw, 976px"
                            priority
                        />
                    </figure>
                ) : (
                    <div className="mt-14 grid gap-4 sm:grid-cols-3">
                        {project.highlights.map((highlight) => (
                            <div key={highlight} className="rounded-xl border border-white/10 bg-black/20 px-6 py-8 text-lg text-white/80">
                                {highlight}
                            </div>
                        ))}
                    </div>
                )}
            </section>
            <div className="relative mx-auto max-w-5xl px-6 pt-12">
                {homepage.features.map(({ title, text }, index) => (
                    <section key={title} className="mt-section grid gap-6 border-t border-white/10 py-10 md:grid-cols-2 md:gap-16">
                        <div>
                            <span className="mb-3 block font-mono text-sm text-sky-300">0{index + 1}</span>
                            <Header size="h2" className="!leading-tight tracking-tight">{title}</Header>
                        </div>
                        <Text className="md:pt-8 text-base sm:text-lg">{text}</Text>
                    </section>
                ))}
                <section className="mt-section rounded-2xl border border-white/10 bg-black/20 px-6 py-12 text-center sm:px-12">
                    <Header size="h2">Get {project.name}</Header>
                    <Text className="mx-auto mt-4 max-w-xl">
                        {homepage.download ? 'Download the Mac app from GitHub Releases.' : 'The Mac app is in development. A public download is coming soon.'}
                    </Text>
                    <div className="mt-6 flex justify-center"><Download href={homepage.download} /></div>
                </section>
            </div>
        </main>
    );
}
