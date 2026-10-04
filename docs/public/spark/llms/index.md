<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

Legend Spark combines native desktop capabilities with an Expo-style workflow. Start in Spark Runner, switch to an app-specific development build for native changes, and build a standalone macOS application with embedded JavaScript.

The single public package is `@legendapp/spark`. Applications use React Native's renderer and Hermes; Node runs the development tooling. npm, pnpm, Yarn, and Bun are supported package-manager choices.

The published experimental preview includes a macOS ARM64 Runner. Current source also includes Intel macOS build targeting, local Windows development, consolidated API contracts, document/window coordination, native UI composition, and AI/Codex execution. These additions have different platform acceptance gates and are newer than the published preview.

- [Overview](/spark/overview)
- [Getting started](/spark/getting-started)
- [API guide](/spark/reference)
- [Status and limitations](/spark/limitations)
- [LLM documentation index](/spark/llms.txt) and [complete documentation](/spark/llms-full.txt)

Source: [LegendApp/legend-spark](https://github.com/LegendApp/legend-spark).
