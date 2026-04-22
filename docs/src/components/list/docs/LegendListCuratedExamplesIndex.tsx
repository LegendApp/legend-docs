import Link from 'next/link';

import { LIST_EXAMPLE_GROUPS } from './exampleDocsData';

export function LegendListCuratedExamplesIndex() {
    return (
        <div className="not-prose mt-8 space-y-10">
            {LIST_EXAMPLE_GROUPS.map(({ examples, group }) => (
                <section key={group} className="space-y-4">
                    <div>
                        <h2 className="m-0 text-2xl font-bold text-fd-foreground">{group}</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {examples.map((example) => (
                            <Link
                                className="rounded-2xl border border-fd-border bg-fd-card p-5 no-underline transition hover:-translate-y-0.5 hover:bg-fd-accent/40"
                                href={`/list/v3/react/examples/${example.slug}`}
                                key={example.slug}
                            >
                                <div className="text-lg font-bold text-fd-foreground">{example.title}</div>
                                <p className="mb-0 mt-2 text-sm leading-6 text-fd-muted-foreground">
                                    {example.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
