'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Download, MoveUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import rawCatalog from '../../../public/slides/effects/catalog.json';

type Effect = { slug: string; title: string; description: string; pack: string; entry: string; tags: string[];
    snippet: string; props: {name: string; description: string}[]; example: {url: string}; preview?: {poster?: string; video?: string; renderer?: string} };
type Catalog = { packs: Record<string, {latest: string; versions: Record<string, {bytes: number; capabilities: string[]}>}>; effects: Effect[] };
const catalog = rawCatalog as Catalog;
const families = Object.keys(catalog.packs).sort();
// Featured in the landing reel, in order; effects without a video are skipped.
const featured = ['fluid', 'window-storm', 'glow-field', 'upward-flames', 'glass-strike', 'constellation', 'animated-title', 'chart-bar'];
const reel = featured.flatMap(slug => catalog.effects.filter(effect => effect.slug === slug && effect.preview?.video));
const frame = 'overflow-hidden rounded-xl border border-[#29313a] bg-[#11171e]';
const label = 'font-mono text-[11px] uppercase tracking-wide text-[#6d8498]';
function installURL(effect: Effect) {
    const params = new URLSearchParams({pack: effect.pack, version: catalog.packs[effect.pack].latest});
    return `legend-slides://effects/install?${params}`;
}
// Loads and plays only while on screen; posters stand in until then and for reduced motion.
function Video({effect, controls = false}: {effect: Effect; controls?: boolean}) {
    const ref = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        const video = ref.current;
        if (!video || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        video.muted = true;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) video.play().catch(() => {});
            else video.pause();
        }, {rootMargin: '200px'});
        observer.observe(video);
        return () => observer.disconnect();
    }, []);
    return <video ref={ref} className="block aspect-[1280/652] w-full object-cover" muted loop playsInline preload="none" controls={controls}
        poster={effect.preview!.poster} src={effect.preview!.video} aria-label={`${effect.title} preview`} />;
}
function Preview({effect, controls}: {effect: Effect; controls?: boolean}) {
    if (effect.preview?.video) return <Video effect={effect} controls={controls} />;
    if (effect.preview?.poster) return <img className="block aspect-[1280/652] w-full object-cover" src={effect.preview.poster} alt={`${effect.title} in Legend Slides`} loading="lazy" />;
    return <div className="flex aspect-[1280/652] flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,#173244,#11171e_70%)] p-6 text-center">
        <span className={label}>{effect.pack}</span>
        <span className="mt-2 text-xl font-medium tracking-[-0.02em] text-white">{effect.title}</span>
        <span className="mt-2 text-[12.5px] text-[#787c85]">Preview coming soon · try the example in Slides</span>
    </div>;
}
function EffectCard({effect}: {effect: Effect}) {
    return <Link href={`/slides/effects/${effect.slug}`} className="group block">
        <div className={`${frame} transition-colors group-hover:border-[#4a5560]`}><Preview effect={effect} /></div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
            <h3 className="font-medium text-white">{effect.title}</h3>
            <span className={label}>{effect.pack}</span>
        </div>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#929da8]">{effect.description}</p>
    </Link>;
}
export function EffectsReel() {
    const [index, setIndex] = useState(0), effect = reel[index];
    return <figure className="m-0">
        <div className={`${frame} shadow-[0_24px_60px_#0008]`}><Preview key={effect.slug} effect={effect} /></div>
        <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Featured effect">
                {reel.map((item, i) => <button key={item.slug} type="button" aria-pressed={i === index} onClick={() => setIndex(i)}
                    className={`rounded-full border px-3 py-1 text-[12.5px] transition-colors ${i === index ? 'border-[#5acaff] bg-[#008ccc]/20 text-white' : 'border-[#29313a] text-[#929da8] hover:border-[#4a5560] hover:text-white'}`}>
                    {item.title}
                </button>)}
            </div>
            <Link href={`/slides/effects/${effect.slug}`} className="inline-flex items-center gap-2 text-[13px] text-[#91c7e9] hover:text-white">
                Use {effect.title} <ArrowRight size={14} />
            </Link>
        </figcaption>
    </figure>;
}
export function EffectsGallery() {
    const [query, setQuery] = useState(''), [family, setFamily] = useState('all');
    const results = catalog.effects.filter(effect => (family === 'all' || effect.pack === family) &&
        `${effect.title} ${effect.description} ${effect.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()));
    return <div>
        <div className="flex flex-wrap items-center gap-3 border-y border-[#29313a] py-4">
            <div className="flex flex-1 flex-wrap gap-2" role="group" aria-label="Effect family">
                {['all', ...families].map(id => <button key={id} type="button" aria-pressed={family === id} onClick={() => setFamily(id)}
                    className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors ${family === id ? 'bg-white/10 text-white' : 'text-[#6d8498] hover:text-white'}`}>
                    {id}
                </button>)}
            </div>
            <input aria-label="Search effects" type="search" placeholder="Search effects…" value={query} onChange={event => setQuery(event.target.value)}
                className="w-full rounded-lg border border-[#29313a] bg-[#11171e] px-3 py-2 text-[13.5px] text-white placeholder:text-[#6d8498] focus:border-[#5acaff] focus:outline-none sm:w-60" />
        </div>
        <p className={`${label} mt-6`} role="status">{results.length} {results.length === 1 ? 'effect' : 'effects'}</p>
        <div className="mt-6 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{results.map(effect => <EffectCard key={effect.slug} effect={effect} />)}</div>
        {results.length === 0 && <p className="text-[#929da8]">No effects match these filters.</p>}
    </div>;
}
export function EffectDetail({slug}: {slug: string}) {
    const effect = catalog.effects.find(item => item.slug === slug);
    const [copyState, setCopyState] = useState('Copy MDX');
    if (!effect) return null;
    const pack = catalog.packs[effect.pack], release = pack.versions[pack.latest];
    const related = catalog.effects.filter(item => item.pack === effect.pack && item.slug !== effect.slug).slice(0, 3);
    async function copy() {
        try { await navigator.clipboard.writeText(effect!.snippet); setCopyState('Copied'); }
        catch { setCopyState('Select and copy the code below'); }
    }
    return <div className="not-prose">
        <Link href="/slides/effects" className="inline-flex items-center gap-2 text-[13px] text-[#91c7e9] hover:text-white"><ArrowLeft size={14} /> All effects</Link>
        <figure className="mt-6">
            <div className={`${frame} shadow-[0_24px_60px_#0008]`}><Preview effect={effect} controls /></div>
            <figcaption className="mt-3 text-xs text-[#787c85]">
                {effect.preview?.renderer ? `${effect.preview.video ? 'Recorded' : 'Captured'} in ${effect.preview.renderer}.` : 'No capture yet. Open the example in Slides to see it live.'}
            </figcaption>
        </figure>
        <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={installURL(effect)} className="button button-primary">Install in Slides <ArrowRight size={15} /></a>
            <a href={`legend-slides://effects/example?effect=${encodeURIComponent(effect.slug)}`} className="button button-outline text-[#d1d6df]">Open example <MoveUpRight size={15} /></a>
            <a href={effect.example.url} download={`${effect.slug}.mdx`} className="button button-quiet"><Download size={15} /> Download example</a>
        </div>
        <p className="mt-5 max-w-2xl text-[13.5px] leading-relaxed text-[#929da8]">Requires a Legend Slides build with effect installation support. Installs the {effect.pack} pack ({pack.latest}, {Math.ceil(release.bytes / 1024)} KB source) and its dependencies. macOS host capabilities: {release.capabilities.join(', ')}. Installed decks work offline.</p>
        <section className="mt-14">
            <h2 className="text-[22px] font-medium tracking-[-0.02em] text-white">Use it in a deck</h2>
            <div className={`${frame} mt-5`}>
                <div className="flex items-center gap-2 border-b border-[#232b33] px-4 py-2.5">
                    <span className="size-2.5 rounded-full bg-white/15" /><span className="size-2.5 rounded-full bg-white/15" /><span className="size-2.5 rounded-full bg-white/15" />
                    <span className="ml-3 flex-1 font-mono text-[11px] text-white/40">{effect.slug}.mdx</span>
                    <button type="button" className="text-[12px] text-[#91c7e9] hover:text-white" onClick={copy}>{copyState}</button>
                </div>
                <pre data-language="mdx" className="!m-0 overflow-x-auto !bg-transparent px-5 py-4 text-[12.5px] leading-[1.7] text-[#c9d3dd]"><code>{effect.snippet}</code></pre>
            </div>
        </section>
        <section className="mt-14">
            <h2 className="text-[22px] font-medium tracking-[-0.02em] text-white">Configure</h2>
            <dl className="mt-5 grid border-t border-[#29313a] sm:grid-cols-2">
                {effect.props.map(prop => <div key={prop.name} className="border-b border-[#29313a] py-4 sm:odd:pr-6 sm:even:border-l sm:even:pl-6">
                    <dt className="font-mono text-[13px] text-white">{prop.name}</dt>
                    <dd className="mt-1.5 text-[13.5px] leading-relaxed text-[#929da8]">{prop.description}</dd>
                </div>)}
            </dl>
            <p className="mt-5 text-[13.5px] text-[#929da8]">Only imported effects enter the compiled deck. <Link href="/slides/effects/installation" className="text-[#91c7e9] hover:text-white">Installation and versioning →</Link></p>
        </section>
        {related.length > 0 && <section data-doc-exclude className="mt-16">
            <h2 className="text-[22px] font-medium tracking-[-0.02em] text-white">More in the {effect.pack} pack</h2>
            <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-3">{related.map(item => <EffectCard key={item.slug} effect={item} />)}</div>
        </section>}
    </div>;
}
