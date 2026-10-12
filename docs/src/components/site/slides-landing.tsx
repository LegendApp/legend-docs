import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import rawCatalog from '../../../public/slides/effects/catalog.json';

const featuredSlugs = ['ambientaurora', 'glass-panels', 'constellation'];
const featuredEffects = featuredSlugs
    .map((slug) => rawCatalog.effects.find((effect) => effect.slug === slug))
    .filter((effect) => effect !== undefined);

export function SlidesProductNav() {
    return (
        <nav className="slides-product-nav container" aria-label="Legend Slides navigation">
            <Link href="/slides" className="slides-wordmark">Legend Slides <span>Preview</span></Link>
            <div>
                <Link href="/slides/reference">Docs</Link>
                <Link href="/slides/effects">Effects</Link>
                <Link href="/slides/availability">Availability</Link>
            </div>
        </nav>
    );
}

export function SlidesLanding() {
    return (
        <main data-doc-content id="main" className="slides-landing">
            <SlidesProductNav />

            <section className="slides-hero container" aria-labelledby="slides-hero-title">
                <div>
                    <span className="slides-label">Native presentations for macOS</span>
                    <h1 id="slides-hero-title">Present from a file.</h1>
                    <p>Write a deck in MDX. Add React Native components when you need them. Present in a native macOS app with notes and a separate audience window.</p>
                    <div className="slides-actions">
                        <Link href="/slides/getting-started" className="button button-primary">Get started <ArrowRight size={16} /></Link>
                        <Link href="/slides/availability" className="slides-text-link">Preview availability <ArrowRight size={16} /></Link>
                    </div>
                    <p className="slides-status">In development. Public downloads are coming.</p>
                </div>
                <Image
                    src="/assets/showcase/slides.png"
                    width={1984}
                    height={1280}
                    priority
                    alt="Legend Slides macOS app showing a Markdown deck and presentation controls"
                />
            </section>

            <section className="slides-deck container" aria-labelledby="slides-deck-title">
                <div className="slides-section-intro">
                    <span className="slides-label">01 / The deck</span>
                    <h2 id="slides-deck-title">Keep the source.</h2>
                    <p>Slides are local MDX files. Headings divide slides; attributes control shared elements and reveals. Speaker notes live beside the content.</p>
                    <a href="/slides/examples/first-deck.mdx" download className="slides-text-link">Download the starter deck <ArrowRight size={16} /></a>
                </div>
                <div className="slides-code">
                    <div>first-deck.mdx</div>
                    <pre data-language="mdx"><code>{`# Make room for your idea. {shared=title shared-resize=preserve}

A little room to think.

<!-- 1: Start with the idea. Let it breathe. -->

---

## Make room for your idea. {shared=title shared-resize=preserve}`}</code></pre>
                </div>
            </section>

            <section className="slides-effects container" aria-labelledby="slides-effects-title">
                <div className="slides-section-header">
                    <div>
                        <span className="slides-label">02 / Effects</span>
                        <h2 id="slides-effects-title">See them in motion.</h2>
                        <p>Recorded in the macOS development app. Each effect has an example deck.</p>
                    </div>
                    <Link href="/slides/effects" className="slides-text-link">Browse all {rawCatalog.effects.length} effects <ArrowRight size={16} /></Link>
                </div>
                <div className="slides-effect-grid">
                    {featuredEffects.map((effect) => (
                        <article key={effect.slug}>
                            <div className="slides-effect-media">
                                {effect.preview?.video ? (
                                    <video muted loop playsInline preload="none" controls poster={effect.preview.poster} aria-label={`${effect.title} recorded in Legend Slides`}>
                                        <source src={effect.preview.video} type="video/mp4" />
                                    </video>
                                ) : effect.preview?.poster ? (
                                    <Image src={effect.preview.poster} width={960} height={540} alt={`${effect.title} in Legend Slides`} />
                                ) : (
                                    <span>Preview coming soon</span>
                                )}
                            </div>
                            <div className="slides-effect-meta"><span>{effect.pack}</span><a href={effect.example.url} download>Example deck ↗</a></div>
                            <h3><Link href={`/slides/effects/${effect.slug}`}>{effect.title}</Link></h3>
                            <p>{effect.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="slides-next container" aria-labelledby="slides-next-title">
                <div>
                    <span className="slides-label">03 / Present</span>
                    <h2 id="slides-next-title">Your notes stay with you.</h2>
                    <p>Rehearse in a window, then present to a separate display.</p>
                </div>
                <div className="slides-next-links">
                    <Link href="/slides/presenting">Presenting in Slides <ArrowRight size={16} /></Link>
                    <Link href="/slides/reference">Read the documentation <ArrowRight size={16} /></Link>
                    <Link href="/slides/ai-authoring">Author a deck with the Slides skill <ArrowRight size={16} /></Link>
                </div>
            </section>
        </main>
    );
}
