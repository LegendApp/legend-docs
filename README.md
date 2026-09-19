# Legend website and documentation

The community-maintained source for [legend.so](https://legend.so): Legend apps, open-source libraries, and Legend Frame. Issues and pull requests belong in this repository.

## Develop

```sh
cd docs
bun install
bun dev
```

The Next.js and Fumadocs app serves directly from `/`.

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

The new landing pages live in `docs/src/app/(site)` with components in `docs/src/components/site`. Styles are scoped to `.legend-site` so they do not change library documentation or examples. The homepage uses a custom Legend hero, app screenshots, images from the library documentation, and short product summaries; there are no separate `/apps` or `/libraries` pages.

## Configuration

Set `GTM_ID` only if analytics should be enabled. `LLMS_BASE_URL` can override the default `https://legend.so` when generating documentation links.

## Contribute

For corrections and documentation improvements, edit `docs/content` and open a pull request. For larger restructuring, start an issue so contributors can discuss the change.

Homepage image sources and the hero generation prompt are documented in [showcase assets](docs/design/showcase-assets.md).

## Cloudflare Pages

- Production branch: `production`
- Root directory: `docs`
- Build command: `bun install --frozen-lockfile && bun run build`
- Output directory: `dist`
- Environment: `BUN_VERSION=1.3.14`, `LLMS_BASE_URL=https://legend.so`

The curated Legend List source listings are checked in under
`docs/vendor/legend-list`, pinned to an upstream commit. No sibling checkout is
needed for deployment. See its [refresh instructions](docs/vendor/legend-list/README.md).

Attach `legend.so` as the Pages custom domain. Pushing to `production` triggers the configured Pages deployment.

## Deploy to production

After merging and pushing the desired changes to `main`, run from the repository root:

```sh
bun run deploy:production --dry-run
bun run deploy:production
```

Requires Git and GitHub CLI (`gh`) authenticated as `jmeistrich`, plus Git push
credentials for the same account. The script promotes the latest remote `main`
commit to `production` with a normal fast-forward push. It creates `production`
on the first deployment. Local commits and uncommitted files are not deployed.
Cloudflare runs the configured install and build command after the push.

GitHub rules restrict creation and updates of `production` to `jmeistrich`.
A separate rule blocks force pushes and deletion for everyone. These rules apply
to direct pushes and PR merges; the script's account check is only a convenience.
Repository administrators can still edit the rules themselves, so administrative
access must remain trusted. No deployment credentials are stored in this repo.
