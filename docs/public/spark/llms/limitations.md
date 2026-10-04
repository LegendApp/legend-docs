<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

## Published preview versus current source

Spark is experimental and not ready for production use. APIs, configuration, native implementations, and binary identities can change.

As checked on **October 4, 2026**, npm offers `@legendapp/spark@0.0.1-next.2`, published September 24. Both `next` and `latest` point to that experimental version. The [matching GitHub prerelease](https://github.com/LegendApp/legend-spark/releases/tag/v0.0.1-next.2) includes the SDK, patched dependency archives, and a **macOS ARM64 Spark Runner**. Public installation and automatic Runner acquisition exist; local SDK transfer remains useful.

These guides were audited against source revision `f2eb14d` from October 3, reflecting the API cleanup through that revision. The published September archive predates that work despite the source retaining the same preview version string. Use [current source setup](/spark/getting-started#current-source-sdk) for the consolidated API. Release artifacts are immutable; a version string alone does not prove an archive contains later source changes.

The latest source can also include work newer than remote `main`. Match your checkout's actual export map and contracts. Engineering links to `main` may lag local development until those commits are pushed.

## Platform acceptance

| Target | Current limits |
| --- | --- |
| macOS ARM64 | Primary development target; source/native fixture evidence is feature-specific. Current per-export release acceptance remains incomplete |
| macOS Intel x64 | Build/registration/download/packaging targeting implemented; native compilation, runtime behavior and signed distribution pending. No Intel asset in the published preview |
| Windows x64/ARM64 | Local Runner/custom development implemented; native compilation and behavioral acceptance pending. No hosted Windows Runner or production packaging workflow |
| iOS / Android / web | Selected adapters only, with their own target acceptance. Core desktop windows/files/menus/processes are not universal capabilities |
| Linux / Mac App Store | Outside the supported workflow |

Common UI controls have different implementations; Windows SegmentedControl is unsupported. Specialized search/sidebar/split-view/SF Symbols are macOS capabilities. GlassView's native effect requires macOS 26. Standalone media sessions for an external playback engine are unsupported on mobile. Web secure storage is explicitly unavailable. Command routing/low-level keyboard and native Codex supervision have macOS restrictions.

The [per-export support matrix](https://github.com/LegendApp/legend-spark/blob/main/docs/release-support-matrix.md) separates intended contracts from recorded acceptance. `not-tested` means a target-specific candidate run is still required. Do not turn a source implementation or passing fixture into an advertised native guarantee.

## Distribution gates

Standalone macOS build/signing/notarization and whole-app update tooling exist. Real Developer ID/notarization, clean-recipient startup, native feature checks, update installation/relaunch, and downgrade rejection remain acceptance requirements tied to exact source and artifact digests. Mocked packaging/update checks do not satisfy them.

The source release pipeline verifies patched native dependency bytes and provenance before installation/assembly. That does not retroactively change the published September archive. Consult [release readiness](https://github.com/LegendApp/legend-spark/blob/main/docs/release-readiness.md) and the [test dossier](https://github.com/LegendApp/legend-spark/blob/main/docs/release-test-dossier.md) for unresolved candidate/dependency gates.

## Architecture limits

- Application JavaScript runs in Hermes. Node built-ins and Electron main-process APIs are unavailable.
- Helpers are app-supplied, target-specific executables requiring a custom binary. They are not persistent OS services.
- Spark SQLite/WebView/audio/UI contracts expose supported subsets, not complete backend APIs.
- Expo Router integration, declarative route-based window navigation, and a broad universal UI catalog remain deferred. `createWindowsNavigator` does provide named-window component coordination.
- Frame → Spark migration requires rebuilding matching native runtimes. Old prototype data/credentials/OS registrations are not automatically migrated.

Review [known Windows issues](https://github.com/LegendApp/legend-spark/blob/main/docs/windows-issues.md) and [migration](/spark/migration) when adopting source changes.
