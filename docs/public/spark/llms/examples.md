<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

## Kitchen Sink

From the current source checkout:

```sh
npm run kitchen-sink
```

After installing/preparing the source SDK, normal development starts the managed session; it does not compile a native runtime. A matching registered Runner is required. If needed, build from the checked-in app:

```sh
cd examples/kitchen-sink
npm run rebuild:macos
npm run macos
# On Windows:
# npm run rebuild:windows
# npm run windows
```

Kitchen Sink demonstrates windows/geometry, menus/shortcuts, files/dialogs, streaming/Trash, settings, clipboard, notifications/system APIs, audio, and native controls. Progress, results, and errors appear inline with detailed logs. Disposable filesystem demos create/recycle test data.

`npm run kitchen-sink:prepare -- /absolute/path/to/KitchenSinkCheck` packs the SDK and creates a separate copied consumer for integration testing. It preserves that consumer's generated identity/configuration rather than changing the checked-in app.

## Smaller applications

After [preparing the source SDK](/spark/getting-started), run from its checkout:

```sh
npm run spark -- create /absolute/path/to/MyNotes --example notes-lite
npm run spark -- create /absolute/path/to/MyMusic --example music-lite
npm run spark -- create /absolute/path/to/MyDiff --example diff-lite
npm run spark -- create /absolute/path/to/MyEditor --example document-editor
```

Notes Lite covers local notes, search, import/export, recovery, and session restoration. Music Lite covers playback/queue ownership. Diff Lite covers text comparison. Document Editor covers file operations, menus, document requests, and desktop lifecycle. These examples are distinct from the full Legend Apps products.

The [helper example](https://github.com/LegendApp/legend-spark/tree/main/examples/sidecar) demonstrates an app-supplied executable without a Node runtime in Hermes. The universal Settings starter uses native controls plus platform adapters.

## Source checks

From the SDK checkout:

```sh
npm run typecheck
npm test
npm run test:templates
```

`npm test` uses Vitest, not Bun's test runner. Source checks validate contract behavior, export policy, lifecycle transitions, and tooling; template checks create real consumers. Packed consumer checks separately validate the archive's dependency graph and declarations.

## Native and platform checks

Native suites need their toolchains and disposable consumer projects. Read prerequisites before running them. Relevant commands include:

| Command | Purpose |
| --- | --- |
| `npm run test:native` | Native API probes |
| `npm run test:ui` | Packed native UI consumer |
| `npm run test:platform -- --platform <target>` | Shared contract catalog on a target |
| `npm run test:windows` | Windows Runner → Fast Refresh → added module → custom build |
| `npm run test:windows:prepare` | Generation/bundles without Windows native execution |
| `npm run test:runtimes:all` | Runner/dev/release background runtimes and pruning |
| `npm run test:universal` / `test:universal:dev` | Universal generation/bundles and shared sessions |
| `npm run test:add-desktop` | Existing Expo app preservation/composition |

Successful generation, TypeScript, native fixture compilation, or bundling is not interactive device acceptance. Historical tests do not validate a changed source revision or renamed/rebuilt binary.

Use the [platform harness](https://github.com/LegendApp/legend-spark/blob/main/docs/platform-testing.md), [manual acceptance checklist](https://github.com/LegendApp/legend-spark/blob/main/docs/desktop-manual-acceptance.md), and [release support matrix](https://github.com/LegendApp/legend-spark/blob/main/docs/release-support-matrix.md) to record exact source/artifacts, platform/architecture, and behavior. See [remaining release gates](/spark/limitations).
