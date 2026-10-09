'use client';

import Link from 'next/link';
import { useState } from 'react';
import rawCatalog from '../../../public/slides/effects/catalog.json';

type Effect = { slug: string; title: string; description: string; pack: string; entry: string; tags: string[];
    snippet: string; props: {name: string; description: string}[]; example: {url: string}; preview?: {poster: string; video?: string; renderer: string} };
type Catalog = { packs: Record<string, {latest: string; versions: Record<string, {bytes: number; capabilities: string[]}>}>; effects: Effect[] };
const catalog = rawCatalog as Catalog;
const families = Object.keys(catalog.packs).sort();
const panel = 'rounded-2xl border border-fd-border bg-fd-card';
const action = 'inline-flex items-center rounded-lg border border-fd-border px-4 py-2 text-sm font-medium no-underline hover:bg-fd-accent';
function installURL(effect: Effect) {
    const params = new URLSearchParams({pack: effect.pack, version: catalog.packs[effect.pack].latest});
    return `legend-slides://effects/install?${params}`;
}
function Preview({effect, play = false}: {effect: Effect; play?: boolean}) {
    if (play && effect.preview?.video) return <video className="w-full rounded-xl" controls playsInline preload="none" poster={effect.preview.poster} src={effect.preview.video} aria-label={`${effect.title} preview`} />;
    if (effect.preview) return <img className="aspect-video w-full rounded-xl object-contain" src={effect.preview.poster} alt={`${effect.title} in Legend Slides`} loading="lazy" />;
    return <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-cyan-950 via-slate-950 to-violet-950 p-6 text-center">
        <div><span className="text-xs uppercase tracking-widest text-cyan-300">{effect.pack}</span><p className="my-3 text-2xl font-semibold text-white">{effect.title}</p><span className="text-sm text-slate-300">Try the native example in Slides ↗</span></div>
    </div>;
}
export function EffectsGallery() {
    const [query, setQuery] = useState(''), [family, setFamily] = useState('all');
    const results = catalog.effects.filter(effect => (family === 'all' || effect.pack === family) &&
        `${effect.title} ${effect.description} ${effect.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()));
    return <div className="not-prose space-y-6">
        <div className="flex flex-wrap gap-3">
            <input aria-label="Search effects" type="search" placeholder="Search effects…" className="min-w-48 flex-1 rounded-lg border border-fd-border bg-fd-card p-3" value={query} onChange={event => setQuery(event.target.value)} />
            <select aria-label="Effect family" className="rounded-lg border border-fd-border bg-fd-card p-3" value={family} onChange={event => setFamily(event.target.value)}>
                <option value="all">All families</option>{families.map(id => <option key={id} value={id}>{id}</option>)}
            </select>
        </div>
        <p className="text-sm text-fd-muted-foreground" role="status">{results.length} {results.length === 1 ? 'effect' : 'effects'}</p>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{results.map(effect => <Link href={`/slides/effects/${effect.slug}`} key={effect.slug} className={`${panel} overflow-hidden p-3 no-underline hover:bg-fd-accent/30`}>
            <Preview effect={effect} /><h2 className="mb-2 mt-4 text-lg font-semibold">{effect.title}</h2><p className="mb-2 text-sm leading-6 text-fd-muted-foreground">{effect.description}</p>
        </Link>)}</div>
        {results.length === 0 && <p>No effects match these filters.</p>}
    </div>;
}
export function EffectDetail({slug}: {slug: string}) {
    const effect = catalog.effects.find(item => item.slug === slug);
    const [copyState, setCopyState] = useState('Copy MDX');
    if (!effect) return null;
    const pack = catalog.packs[effect.pack], release = pack.versions[pack.latest];
    async function copy() {
        try { await navigator.clipboard.writeText(effect!.snippet); setCopyState('Copied'); }
        catch { setCopyState('Select and copy the code below'); }
    }
    return <div className="not-prose space-y-6">
        <Link href="/slides/effects" className="text-sm text-fd-muted-foreground">← All effects</Link>
        <Preview effect={effect} play />
        {effect.preview && <p className="text-xs text-fd-muted-foreground">{effect.preview.video ? 'Video recorded in' : 'Still captured in'} {effect.preview.renderer}.</p>}
        <div className="flex flex-wrap gap-3">
            <a href={installURL(effect)} className={`${action} bg-fd-primary text-fd-primary-foreground`}>Install in Slides</a>
            <a href={`legend-slides://effects/example?effect=${encodeURIComponent(effect.slug)}`} className={action}>Open example in Slides</a>
            <a href={effect.example.url} download={`${effect.slug}.mdx`} className={action}>Download example</a>
        </div>
        <p className="text-sm leading-6 text-fd-muted-foreground">Requires a Legend Slides build with effect installation support. Installs the {effect.pack} pack ({pack.latest}, {Math.ceil(release.bytes / 1024)} KB source) and its dependencies. macOS host capabilities: {release.capabilities.join(', ')}. Installed decks work offline.</p>
        <div className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Use it in a deck</h2><button type="button" className={action} onClick={copy}>{copyState}</button></div>
            <pre data-language="mdx" className={`${panel} overflow-x-auto p-5 text-sm`}><code>{effect.snippet}</code></pre>
        </div>
        <h2 className="text-xl font-semibold">Configure</h2><dl className="space-y-4">{effect.props.map(prop => <div key={prop.name}><dt className="font-mono text-sm font-semibold">{prop.name}</dt><dd className="ml-0 mt-1 text-sm text-fd-muted-foreground">{prop.description}</dd></div>)}</dl>
        <p className="text-sm text-fd-muted-foreground">Only imported effects enter the compiled deck. <Link href="/slides/effects/installation">Installation and versioning →</Link></p>
    </div>;
}
