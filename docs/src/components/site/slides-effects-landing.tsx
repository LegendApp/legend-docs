import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import rawCatalog from '../../../public/slides/effects/catalog.json';
import { EffectsGallery, EffectsReel } from '@/components/slides/EffectsGallery';
import { SlidesProductNav } from './slides-landing';

const steps = [
    { label: 'Install', text: 'Effects ship in small, versioned packs. Slides shows the pack and version before installing it.', code: 'legend-slides://effects/install?pack=backgrounds' },
    { label: 'Import', text: 'Import an effect into your MDX like any component. Only what you import enters the deck.', code: 'import { Fluid } from "slides:backgrounds/Fluid";' },
    { label: 'Present', text: 'A lockfile beside the deck pins exact versions. Compiling and playback make no network requests.', code: '<Background><Fluid /></Background>' },
];

const docs = [
    { label: 'Installing effects', href: '/slides/effects/installation', text: 'Packs, versions, and offline decks' },
    { label: 'Publishing packs', href: '/slides/effects/publishing', text: 'Add effects to the gallery' },
    { label: 'Backgrounds', href: '/slides/backgrounds-and-effects', text: 'Put an effect behind a slide' },
    { label: 'Components', href: '/slides/components', text: 'Bring your own React Native views' },
];

export function SlidesEffectsLanding() {
    return (
        <main data-doc-content id="main" className="pb-24">
            <SlidesProductNav />
            <section className="container pt-16 sm:pt-20">
                <div className="lg:grid lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-14">
                    <h1 className="text-[44px] font-medium leading-[1.05] tracking-[-0.045em] text-white sm:text-[58px]">
                        Effects for a bigger screen.
                    </h1>
                    <div className="mt-6 lg:mt-0">
                        <p className="max-w-[480px] text-[17px] leading-relaxed text-[#a4adb6]">
                            {rawCatalog.effects.length} native effects for backgrounds, materials, particles, charts, and
                            more. Install a small pack, import it into your MDX, and present.
                        </p>
                        <div className="mt-7 flex flex-wrap items-center gap-3">
                            <a href="#all-effects" className="button button-primary">
                                Browse all effects <ArrowDown size={15} />
                            </a>
                            <Link href="/slides/effects/installation" className="button button-outline text-[#d1d6df]">
                                Installing effects <ArrowRight size={15} />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-14">
                    <EffectsReel />
                </div>
                <p className="mt-3 text-xs text-[#787c85]">Real captures from the macOS development app.</p>
            </section>

            <section className="container pt-28 sm:pt-32">
                <h2 className="text-[26px] font-medium tracking-[-0.02em] text-white">One import away.</h2>
                <ol className="mt-10 grid gap-x-8 gap-y-12 lg:grid-cols-3">
                    {steps.map(({ label, text, code }, i) => (
                        <li key={label} className="flex flex-col border-t border-[#29313a] pt-5">
                            <span className="font-mono text-[11px] tracking-wide text-[#6d8498]">
                                0{i + 1} / {label.toUpperCase()}
                            </span>
                            <p className="mt-3 mb-5 flex-1 text-[13.5px] leading-relaxed text-[#929da8]">{text}</p>
                            <code className="block overflow-x-auto rounded-lg border border-[#29313a] bg-[#11171e] px-4 py-3 text-[12.5px] text-[#a4b4c5]">
                                {code}
                            </code>
                        </li>
                    ))}
                </ol>
            </section>

            <section id="all-effects" className="container scroll-mt-8 pt-28 sm:pt-32">
                <h2 className="text-[26px] font-medium tracking-[-0.02em] text-white">Every effect.</h2>
                <p className="mt-4 mb-10 max-w-xl text-[15px] leading-relaxed text-[#929da8]">
                    Each one comes with a complete example deck. Open it in Slides, or copy the MDX into your own.
                </p>
                <EffectsGallery />
            </section>

            <section className="container grid gap-12 pt-28 sm:pt-32 lg:grid-cols-2 lg:gap-14">
                <div>
                    <h2 className="text-[26px] font-medium tracking-[-0.02em] text-white">Go further</h2>
                    <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[#929da8]">
                        Effects are React Native components in versioned packs. Learn how decks pin them, or publish
                        your own.
                    </p>
                </div>
                <div className="grid content-start border-t border-[#29313a]">
                    {docs.map(({ label, href, text }) => (
                        <Link
                            key={href}
                            href={href}
                            className="group flex items-center gap-4 border-b border-[#29313a] py-4 text-[#929da8] hover:text-white"
                        >
                            <span className="w-36 shrink-0 font-medium text-white">{label}</span>
                            <span className="flex-1 text-[13.5px]">{text}</span>
                            <ArrowRight size={15} className="text-[#697b88] transition-colors group-hover:text-white" />
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
