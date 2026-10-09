# Slides effects releases

`public/slides/effects/catalog.json` and its immutable source artifacts are served
by the normal Legend docs static export at `https://legend.so/slides/effects/`.
The site builds without a Legend Apps checkout. Effects are grouped into small
family packs; neither the gallery nor pack source is imported by the native app.

## Update the catalog

1. Make and verify the effect in `legend-apps/packages/slides-effects/packs`.
   Change its `pack.json` version when runtime source changes. Published versions
   must keep the same checksum. Keep exact dependency versions compatible.
2. Add/update a self-contained MDX example under `examples/<slug>/example.mdx`
   and the matching metadata/snippet in `packages/slides-effects/catalog.json`.
3. From `legend-docs/docs`, run `bun run effects:refresh`. Set `LEGEND_APPS_PATH`
   if the Apps checkout is not a sibling. Each example is compiled against the
   exact archived pack sources, including dependencies, before it is listed.
   `bun run effects:refresh --examples-only` updates examples and pages against
   existing releases without publishing changed local pack sources.
4. Capture native example playback and add optional `preview` metadata to the
   catalog: `{poster, video, renderer, exampleSha256, packSha256}`. Both URLs belong under `/slides/effects/`.
   Use actual native renders; browser lookalikes cannot validate Skia/WebGPU effects.
   Refresh preserves previews only while the example and primary pack checksums match.
   Check the final clip at normal speed; in headless environments, inspect dense
   ordered frames and document that normal-speed review was unavailable.
5. Run `bun run effects:verify` and `bun run build`. Commit the source catalog,
   generated pages, examples and immutable artifacts together. Deploy through the
   site's existing workflow after review; refreshing does not deploy.

Old version artifacts stay available for pinned decks. Do not replace them or
remove them to update `latest`. Source archives contain UTF-8 TS/TSX/JSON files;
there are no native binaries or package-manager installs in the download path.

## Verify installation locally

Start the docs server, then point the compiler at its catalog:

```sh
LEGEND_SLIDES_EFFECTS_CATALOG=http://127.0.0.1:3010/slides/effects/catalog.json \
LEGEND_SLIDES_EFFECT_PACKS=/path/to/test-effects \
bun /path/to/legend-apps/scripts/compile-slides.ts /path/to/deck.mdx --install-effects
```

Keep the generated `.mdx.effects.lock.json` beside the deck. Stop the server and
compile again to verify offline resolution. A different pack version is installed
alongside an existing one; existing deck pins are retained. Checksums cover the
archive and every extracted source file. Failed downloads leave no active partial
pack, and an installation lease protects concurrent installs.

The `legend-slides` URL scheme requires a rebuilt macOS development/release app.
The gallery's install links name an exact pack version. Its example links install
the pack/dependencies and open an isolated sample through the normal deck-opening
policy. The presenter offers a retry action when opening a deck with missing packs.
Installing is disabled during presentation. The production links become usable
after both the catalog deployment and an app release containing the installer.

## Initial catalog validation

The initial catalog contains nine source-only packs and 33 examples compiled
against their archived releases. Each example was loaded in a macOS development
app, including its declared reveal states, with no reported build/runtime errors.
Installation was exercised through the native compiler command and offline
compilation was covered by the installer and packaged-helper integration tests.
This did not verify physical clicks through the OS deep-link confirmation dialog.

All entries have native still previews. Nine entries also have video previews
that passed automated motion checks with ScreenCaptureKit source telemetry;
measured source cadence was about 57 fps at a 60 fps capture target. Other clips
had unresolved motion findings and are represented by stills. Final video review
used dense ordered frames because normal-speed browser playback was unavailable;
these results do not certify 60 fps app performance. The videos crop the window
title bar and scale/compress the original capture without changing playback speed.
