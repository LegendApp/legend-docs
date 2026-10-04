<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

Legend Spark adds native desktop capabilities and a managed development workflow to React Native and Expo Desktop. Build React Native screens, use native windows, menus, dialogs, and files, and edit JavaScript with Fast Refresh.

The public package is `@legendapp/spark`; the CLI is `spark`. The single package includes its private implementation modules. Application code imports capability paths such as `@legendapp/spark/files` rather than installing internal `@legendapp/spark-*` packages.

## How the pieces fit

- **React Native** renders native interfaces. Application JavaScript runs in Hermes.
- **Expo** supplies mobile/web tooling and selected library backends.
- **Expo Desktop** creates projects and generates native desktop hosts.
- **Spark** supplies desktop APIs, native compatibility checks, runtime selection, and build/packaging orchestration. Expo CLI owns Metro and the development terminal.

Node 24.19.0 or newer runs the tooling. npm, pnpm, Yarn, and Bun are package-manager choices; Bun is optional. Neither Node nor Bun is embedded in the application.

## Three runtime choices

| Runtime | Native contents | JavaScript |
| --- | --- | --- |
| Spark Runner | Shared SDK development profile | Metro / Fast Refresh |
| Custom development build | SDK plus app-specific native dependencies/configuration | Metro / Fast Refresh |
| Standalone macOS application | Production-selected native modules | Embedded bundle |

Start with a compatible Runner. Adding native dependencies, helper executables, or native configuration can require a custom build. Compatibility checks include SDK, architecture, and native signatures. JavaScript-only changes do not require rebuilding.

## Platform scope

| Target | Implemented workflow | Acceptance limits |
| --- | --- | --- |
| macOS 14+, Apple Silicon | Runner, custom development, standalone builds and packaging | Experimental; current release acceptance is feature-specific |
| macOS 14+, Intel x64 | Architecture selection across builds, Runner registration/downloads and packaging | Native Intel compilation/runtime acceptance pending; published Runner is ARM64 only |
| Windows 11, x64/ARM64 | Local Runner and custom development builds | Native acceptance pending; no production build/distribution workflow or hosted Windows Runner |
| iOS / Android / web | Expo workflows and selected shared API/UI adapters | Desktop APIs do not imply mobile/web support |
| Linux / Mac App Store | Outside the supported workflow | No support claim |

The source targets Expo SDK 54, React Native 0.81, and Expo Desktop `1.0.0-beta.6`. Implementation, successful bundling, and interactive acceptance are separate evidence. Consult the [status page](/spark/limitations) and the repository's [per-export support matrix](https://github.com/LegendApp/legend-spark/blob/main/docs/release-support-matrix.md).

## Application architecture

For Electron migrations, replace DOM/CSS screens with React Native screens and browser/main-process integrations with supported capabilities. Spark has no Electron compatibility layer. An optional [WebView](/spark/integrations) can host selected web content.

[Helper processes](/spark/integrations) run app-supplied executables. Independent background Hermes heaps use `@react-native-runtimes/core` directly; they remain inside the app process and end when it quits.

## Explore

- [Getting started](/spark/getting-started): published preview and current source setup.
- [Development](/spark/development) and [configuration](/spark/configuration): runtimes, Expo integration, and native changes.
- [API guide](/spark/reference): every public capability and shared contracts.
- [Native UI](/spark/ui), [AI execution](/spark/ai), and [examples](/spark/examples).
- [Packaging and updates](/spark/distribution) and [migration](/spark/migration).

[LLM documentation index](/spark/llms.txt) · [Complete LLM documentation](/spark/llms-full.txt)
