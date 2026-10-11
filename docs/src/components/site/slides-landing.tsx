import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, Braces, Download, FileText, Monitor, MoveUpRight, Presentation } from 'lucide-react';
import rawCatalog from '../../../public/slides/effects/catalog.json';
import { SlidesPreview } from './slides-preview';

const featured = ['ambientaurora', 'glass-panels', 'constellation'];
const effects = featured
    .map((slug) => rawCatalog.effects.find((effect) => effect.slug === slug))
    .filter((effect) => effect !== undefined);
const guides = [
    { number: '01', title: 'Your first deck', href: 'getting-started', text: 'A file, a few headings, a presentation.' },
    { number: '02', title: 'Find your layout', href: 'layouts', text: 'Columns, grids, and room for each idea.' },
    { number: '03', title: 'Build the story', href: 'steps-and-notes', text: 'Reveals, speaker notes, and pacing.' },
    { number: '04', title: 'Make it move', href: 'transitions', text: 'Shared elements and focus transitions.' },
    { number: '05', title: 'Make it yours', href: 'components', text: 'Your React components, right in the deck.' },
    { number: '06', title: 'Take the stage', href: 'presenting', text: 'Rehearse, choose displays, and present.' },
];

export function SlidesLanding() {
    return (
        <main data-doc-content id="main" className="slides-landing">
            <nav className="slides-product-nav container" aria-label="Legend Slides navigation">
                <Link href="/slides" className="slides-wordmark">
                    <Presentation size={20} /> Legend Slides <span>PREVIEW</span>
                </Link>
                <div>
                    <Link href="/slides/reference">Docs</Link>
                    <Link href="/slides/effects">Effects</Link>
                    <Link href="/slides/availability">Availability</Link>
                </div>
            </nav>
            <section className="slides-hero container" aria-labelledby="slides-hero-title">
                <div className="slides-hero-copy">
                    <div className="eyebrow">
                        <span className="blue-dot" /> NATIVE PRESENTATIONS FOR MACOS
                    </div>
                    <h1 id="slides-hero-title">
                        A little Markdown.<br /><em>A bigger idea.</em>
                    </h1>
                    <p>
                        Write in plain text. Compose with React.<br />Present with a little more possibility.
                    </p>
                    <div className="hero-actions">
                        <Link href="/slides/getting-started" className="button button-primary">
                            Create your first deck <ArrowRight size={16} />
                        </Link>
                        <Link href="/slides/effects" className="button button-quiet">
                            Explore the effects <MoveUpRight size={15} />
                        </Link>
                    </div>
                    <p className="slides-preview-status">In development for macOS. Public downloads are coming.</p>
                    <a href="#slides-workflow" className="slides-scroll-link">
                        <ArrowDown size={14} /> FROM THE FIRST WORD TO THE BIG SCREEN
                    </a>
                </div>
                <SlidesPreview />
            </section>
            <div className="slides-capabilities container" aria-label="Presentation capabilities">
                <span><FileText size={16} /> Local MDX files</span>
                <span><Braces size={16} /> React Native components</span>
                <span><Presentation size={16} /> Notes &amp; reveals</span>
                <span><Monitor size={16} /> Dedicated audience window</span>
            </div>
            <section id="slides-workflow" className="slides-workflow container" aria-labelledby="slides-workflow-title">
                <div className="slides-section-heading">
                    <span className="eyebrow">LESS BETWEEN YOU AND THE IDEA</span>
                    <h2 id="slides-workflow-title">Start simple.<br />Go somewhere interesting.</h2>
                    <p>
                        Start with a heading. Add a few attributes for motion.<br />
                        A local component opens up everything else.
                    </p>
                </div>
                <div className="slides-source-grid">
                    <div className="slides-source">
                        <div><FileText size={14} /><span>product-update.mdx</span><span>JUST A FILE</span></div>
                        <pre data-language="mdx"><code>
                            <span className="slides-code-muted"># A clear idea</span>{' '}
                            <span className="slides-code-blue">{'{shared=title}'}</span>
                            {'\n\nA little room to think.\n\n'}
                            <span className="slides-code-muted">---</span>{'\n\n'}
                            <span className="slides-code-muted">## A clear idea</span>{' '}
                            <span className="slides-code-blue">{'{shared=title}'}</span>{'\n\n'}
                            <span className="slides-code-blue">{'{steps}'}</span>
                            {'\n\n- Write.\n- Compose.\n- Present.\n\n'}
                            <span className="slides-code-muted">{'<!-- Your notes stay with you. -->'}</span>
                        </code></pre>
                        <a href="/slides/examples/first-deck.mdx" download className="slides-download">
                            <Download size={15} /> Download the starter deck
                        </a>
                    </div>
                    <div className="slides-workflow-copy">
                        <article>
                            <span>01 / WRITE</span><h3>Your words. Your files.</h3>
                            <p>Keep decks, images, and components together. Edit in Slides or your favorite editor. The source stays yours.</p>
                        </article>
                        <article>
                            <span>02 / COMPOSE</span><h3>Small syntax. Big possibilities.</h3>
                            <p>Lay out Markdown, reveal it in steps, move a shared title between slides, or bring your own native component.</p>
                        </article>
                        <article>
                            <span>03 / PRESENT</span><h3>You see the notes. They see the idea.</h3>
                            <p>Rehearse in a window, then give your audience its own display. Lock updates while presenting and apply changes when you are ready.</p>
                        </article>
                    </div>
                </div>
            </section>
            <section className="slides-effects-section" aria-labelledby="slides-effects-title">
                <div className="container">
                    <div className="slides-section-heading slides-heading-row">
                        <div>
                            <span className="eyebrow">A LITTLE ATMOSPHERE</span>
                            <h2 id="slides-effects-title">Make the room look up.</h2>
                        </div>
                        <Link href="/slides/effects">All {rawCatalog.effects.length} effects <ArrowRight size={16} /></Link>
                    </div>
                    <div className="slides-effect-strip">
                        {effects.map((effect) => (
                            <Link key={effect.slug} href={`/slides/effects/${effect.slug}`} className="slides-featured-effect">
                                {effect.preview && (
                                    <div>
                                        <Image
                                            src={effect.preview.poster}
                                            width={960}
                                            height={540}
                                            alt={`${effect.title} captured in Legend Slides for macOS`}
                                        />
                                    </div>
                                )}
                                <span>{effect.pack.toUpperCase()} <MoveUpRight size={15} /></span>
                                <h3>{effect.title}</h3><p>{effect.description}</p>
                            </Link>
                        ))}
                    </div>
                    <p className="slides-effects-note">Real captures from the macOS development app. Optional packs install separately, with versions pinned to your deck.</p>
                </div>
            </section>
            <section className="slides-native container" aria-labelledby="slides-native-title">
                <div className="slides-section-heading">
                    <span className="eyebrow">MADE FOR THE STAGE. BUILT FOR THE MAC.</span>
                    <h2 id="slides-native-title">A native home<br />for your next talk.</h2>
                    <p>
                        A source editor, slide previews, speaker notes, and display controls.<br />
                        A workspace that gives presenting its own space.
                    </p>
                    <Link href="/slides/presenting">Inside the presenter workspace <ArrowRight size={16} /></Link>
                </div>
                <figure>
                    <Image
                        src="/assets/showcase/slides.png"
                        width={1984}
                        height={1280}
                        alt="Legend Slides on macOS showing a six-card native Markdown layout and presentation controls"
                    />
                    <figcaption>The native app, showing a Markdown grid layout.</figcaption>
                </figure>
            </section>
            <section className="slides-guides container" aria-labelledby="slides-guides-title">
                <div className="slides-section-heading slides-heading-row">
                    <div>
                        <span className="eyebrow">FROM HELLO TO SHOWTIME</span>
                        <h2 id="slides-guides-title">Build your next presentation.</h2>
                    </div>
                    <Link href="/slides/reference">All documentation <ArrowRight size={16} /></Link>
                </div>
                <div className="slides-guide-grid">
                    {guides.map((guide) => (
                        <Link key={guide.href} href={`/slides/${guide.href}`}>
                            <span>{guide.number}<ArrowRight size={16} /></span>
                            <h3>{guide.title}</h3><p>{guide.text}</p>
                        </Link>
                    ))}
                </div>
                <div className="slides-ai-link">
                    <Braces size={25} />
                    <div>
                        <h3>A good idea can start with a prompt.</h3>
                        <p>Use the Legend Slides skill to draft a deck with an AI agent, then make it yours.</p>
                    </div>
                    <Link href="/slides/ai-authoring">Meet the authoring skill <ArrowRight size={16} /></Link>
                </div>
            </section>
            <section className="slides-closing container">
                <span className="eyebrow">THE NEXT BIG IDEA IS YOURS</span>
                <h2>Give it a bigger screen.</h2>
                <Link href="/slides/getting-started" className="button button-primary">
                    Start with a deck <ArrowRight size={16} />
                </Link>
                <p>Preview for macOS · <Link href="/slides/availability">Release status</Link></p>
            </section>
        </main>
    );
}
