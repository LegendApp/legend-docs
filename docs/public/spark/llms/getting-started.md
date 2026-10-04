<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

## Published experimental preview

Install Node **24.19.0 or newer**. A published preview is available as `@legendapp/spark@next`:

```sh
npx @legendapp/spark@next create MyApp
cd MyApp
npm run macos
```

The matching GitHub prerelease supplies patched dependencies and a macOS ARM64 Spark Runner, downloaded on first desktop launch. A compatible Runner launch does not require Xcode or CocoaPods. Keep the generated lockfile and project-relative `spark-packages/` archives so clones can reinstall the same inputs.

The published `0.0.1-next.2` archive is the September 24 preview. It does **not** contain the later API cleanup described in these guides. Use the current source workflow below for those APIs. The npm `latest` tag also points to this experimental version; it does not indicate a stable release. See [status](/spark/limitations).

Creation accepts `--package-manager npm|pnpm|yarn|bun`. Existing projects use their `packageManager` field or lockfile. The calling manager is preferred for new projects, with npm as fallback.

## Current source SDK

On macOS 14+, install Git, Node 24.19.0+, full Xcode with first-launch setup complete, and CocoaPods. Native build tools are needed to build a matching Runner or custom binary.

```sh
git clone https://github.com/LegendApp/legend-spark.git
cd legend-spark
nvm install
nvm use
npm install
npm run spark -- sdk pack
npm run spark -- sdk build-runner
```

`pack` creates local SDK archives, patched native dependency archives, and Expo Desktop templates, and registers their manifest. It fetches pinned upstream inputs on its first run. `build-runner` compiles and registers a matching development runtime. Source/local SDKs require that local registration rather than inheriting the published preview's Runner.

If a matching runtime is already available, register its location instead:

```sh
npm run spark -- sdk register /absolute/path/to/SparkRunner.app
```

Keep the runtime at that path. SDK/native changes can make it incompatible.

## Create an app from the source SDK

From the framework checkout:

```sh
npm run spark -- create /absolute/path/to/MyApp
cd /absolute/path/to/MyApp
npm run macos
```

Edit `App.tsx`. JavaScript changes use Fast Refresh. For a shared Settings starter with desktop/mobile/web adapters, run from the checkout:

```sh
npm run spark -- create /absolute/path/to/MySettings --universal
```

Use its generated `macos`, `windows`, `ios`, `android`, and `web` scripts. Some mobile dependencies require a development build rather than Expo Go.

## Windows source development

On Windows 11, install the toolchain from the [Windows guide](https://github.com/LegendApp/legend-spark/blob/main/docs/windows-slice.md), including Visual Studio 2026 / MSVC v145 for the pinned RNW template. Then:

```powershell
npm install
npm run spark -- sdk pack --platform windows
npm run spark -- sdk build-runner --platform windows
npm run spark -- create C:\dev\MySparkApp --platform windows
cd C:\dev\MySparkApp
npm run windows
```

The target defaults to the machine's native x64/ARM64 architecture, including ARM64 Windows in Parallels. This is a local development path; Windows native acceptance and production distribution remain open.

## Build without Metro on macOS

From a generated macOS app:

```sh
npm run build
npx --no-install spark open
```

The build embeds JavaScript in an ad-hoc-signed `.app`. [Packaging](/spark/distribution) adds Developer ID signing and notarization with your credentials; publishing remains separate.
