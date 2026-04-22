import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import Link from 'next/link';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

import type { ExampleSlug } from '@/components/list/examples-shared/catalog';

import { CuratedExamplePreview } from './CuratedExamplePreview';
import { LIST_EXAMPLE_DOCS_BY_SLUG } from './exampleDocsData';

function resolveLegendListRoot() {
    const cwd = process.cwd();
    const candidates = [path.resolve(cwd, '..', 'legend-list'), path.resolve(cwd, '..', '..', 'legend-list')];

    for (const candidate of candidates) {
        if (fs.existsSync(path.join(candidate, 'example-web', 'src'))) {
            return candidate;
        }
    }

    throw new Error(`Could not resolve legend-list root from ${cwd}`);
}

async function readExampleSource(sourcePath: string) {
    const legendListRoot = resolveLegendListRoot();
    return fsPromises.readFile(path.join(legendListRoot, sourcePath), 'utf8');
}

export async function LegendListCuratedExamplePage({ slug }: { slug: ExampleSlug }) {
    const example = LIST_EXAMPLE_DOCS_BY_SLUG[slug];
    const source = await readExampleSource(example.sourcePath);

    return (
        <div className="not-prose mt-8 space-y-8">
            <section className="space-y-3">
                <div
                    className={
                        example.windowScroll
                            ? 'rounded-2xl border border-fd-border bg-fd-card p-4'
                            : 'flex h-[820px] min-h-0 flex-col rounded-2xl border border-fd-border bg-fd-card p-4'
                    }
                >
                    <CuratedExamplePreview showTitle={false} slug={slug} variant={example.variant} />
                </div>
                {example.sourceUsesWindowScroll ? (
                    <p className="m-0 text-sm leading-6 text-fd-muted-foreground">
                        The canonical example uses `useWindowScroll`. The embedded docs version is framed so it fits
                        inside this page, but the source below shows the real example implementation.
                    </p>
                ) : null}
            </section>

            <section className="space-y-3">
                <div className="text-sm font-semibold text-fd-foreground">Features used</div>
                <ul className="m-0 list-disc space-y-2 pl-6 text-sm leading-7 text-fd-muted-foreground">
                    {example.featuresUsed.map((feature) => (
                        <li key={feature.name}>
                            <code>{feature.name}</code> {feature.description}
                        </li>
                    ))}
                </ul>
            </section>

            <section className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                    <p className="m-0 text-sm leading-6 text-fd-muted-foreground">{example.sourcePath}</p>
                    <Link
                        className="shrink-0 text-sm font-semibold text-sky-600 no-underline hover:text-sky-700"
                        href={example.githubUrl}
                        target="_blank"
                    >
                        View source in legend-list
                    </Link>
                </div>
                <div className="overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
                    <DynamicCodeBlock code={source.trim()} lang="tsx" />
                </div>
            </section>
        </div>
    );
}
