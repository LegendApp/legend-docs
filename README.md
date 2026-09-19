# Legend website and documentation

The community-maintained source for [legend.so](https://legend.so): Legend apps, open-source libraries, and Legend Framework. Issues and pull requests belong in this repository.

## Develop

```sh
cd docs
bun install
bun dev
```

The existing Next.js and Fumadocs app serves directly from `/`, without an `/open-source` base path.

```sh
bun run build
```

The build validates content links, generates per-version LLM documentation, and exports the site to `docs/dist/` (the Next.js build cache is `docs/.next/`). Deploy `dist/` using trailing-slash directory indexes and a custom `404.html`. Search is a static index at `/api/search`.

## Organization

- `/`: a single overview of Legend, apps, open-source libraries, and the framework; navigation links to page sections
- `/list`, `/state`, `/motion`: existing library entry points and versioned documentation
- `/framework`, `/diff`, `/markdown`, `/music`, `/slides`, `/code`, `/chat-history`, `/hello-world`: new framework and app pages
- `/blog`: existing articles

Library documentation and interactive examples stay in their existing locations. App and framework documentation is placeholder content while those projects prepare for release. Kitchen sink is excluded.

The new landing pages live in `docs/src/app/(site)` with components in `docs/src/components/site`. Styles are scoped to `.legend-site` so they do not change library documentation or examples. The homepage uses a custom Legend hero, app screenshots, illustrated library previews, and short product summaries; there are no separate `/apps` or `/libraries` pages.

## Before switching domains

This branch prepares the source locally; it does not publish the site or change the existing deployment. Configure hosting for `legend.so`, then set up permanent redirects on the old host from `legendapp.com/open-source/*` to the corresponding `legend.so/*` path, preserving query strings. Keep separate mappings for historical URLs that no longer match current versioned routes. Verify redirects, search, assets, and representative interactive examples before switching traffic.

Set `GTM_ID` only if analytics should be enabled. `LLMS_BASE_URL` can override the default `https://legend.so` when generating documentation links.

## Contribute

For corrections and documentation improvements, edit `docs/content` and open a pull request. For larger restructuring, start an issue so contributors can discuss the change.

Homepage image sources and the hero generation prompt are documented in [showcase assets](docs/design/showcase-assets.md).
