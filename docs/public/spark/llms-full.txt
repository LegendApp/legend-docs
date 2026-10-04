## ai

<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

## Installed command-line tools

`@legendapp/spark/ai` owns execution helpers for installed Claude and Codex CLIs. It uses Spark processes and requires a desktop process host. Installation, login, prompts, provider policy, and data validation remain application/user responsibilities. Importing helpers does not run a prompt.

```ts
import { getAICommandAvailability, runAITool, parseAIJson } from '@legendapp/spark/ai';

const availability = await getAICommandAvailability({ preferredTool: 'codex' });
if (availability.preferredTool) {
  const result = await runAITool({
    tool: availability.preferredTool,
    prompt: 'Return a JSON object containing a greeting.',
    timeoutMs: 30_000,
  });
  if (result.exit.type === 'exited' && result.exit.code === 0) {
    const value = parseAIJson(result.output);
    console.log(value);
  }
}
```

Availability is an advisory installed-command probe, not authenticated access. `runAITool` retains the process result, including raw stdout/stderr bytes, discriminated exit, timeout/abort, and truncation. `output` is trimmed UTF-8 stdout, falling back to stderr if stdout is empty. Nonzero exit and termination are results; operational failures reject.

`signal`, `cwd`, and `timeoutMs` follow the process contract. Codex model/reasoning settings go in `invocationOptions.codex`. The Codex exec recipe uses ephemeral execution and ignores user config/exec-policy rule files while retaining the CLI's sandbox/approval mechanism. Protocol/flags depend on the installed tool version.

`buildAIInvocation` returns the argument recipe without execution. JSON helpers extract raw/fenced/prose-wrapped content and return unknown/null; validate application schemas before using it. `formatAIErrorOutput(output, { maxLength })` bounds error previews. No React mount is required.

## Native Codex app-server

`@legendapp/spark/ai/codex` supplies an optional **macOS** native supervisor, with exec fallback when its app-server protocol is unavailable. `getCodexAvailability()` safely reports unsupported hosts/missing modules and installed-command information. A consuming app needs the matching native capability and rebuilt host.

```ts
import { runCodexPrompt, shutdownCodex } from '@legendapp/spark/ai/codex';

const result = await runCodexPrompt('Return a greeting as JSON.', {
  outputSchema: {
    type: 'object',
    properties: { greeting: { type: 'string' } },
    required: ['greeting'],
    additionalProperties: false,
  },
  reasoningEffort: 'low',
  timeoutMs: 120_000,
});
console.log(result.output);
await shutdownCodex();
```

The final line represents application-owned shutdown. The supervisor is process-wide. `cancelActiveCodexRuns()` cancels all accepted runs, including startup, and returns a count. `shutdownCodex()` cancels active runs and stops the server; later execution restarts it. These are not per-component or per-request cleanup operations. This backend does not promise a per-request AbortSignal.

`timeoutMs` is a whole number from 1,000 to 86,400,000 milliseconds. The isolated Codex home reuses existing authentication; the library does not acquire credentials. Pre-ack notification buffering is bounded at 16 MiB and excessive buffering fails explicitly.

Source/transport/native fixture checks do not establish authenticated inference or full React Native/Nitro acceptance. See [the AI guide](https://github.com/LegendApp/legend-spark/blob/main/docs/ai.md).


## configuration

<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

## Spark-owned projects

Edit `desktop.config.json`; generated `app.json` is Expo's transport configuration. Universal projects use a generated `app.config.js` resolver. Retain the generated stable `projectId`: it scopes storage and runtime identity across app renames and builds.

```json
{
  "$schema": "./node_modules/@legendapp/spark/schema.json",
  "projectId": "f478dff4-f9a1-4ff2-8096-64df89e1c470",
  "name": "MyApp",
  "version": "0.0.1",
  "platforms": ["macos"],
  "window": {
    "size": { "width": 1000, "height": 700 },
    "minSize": { "width": 500, "height": 300 },
    "restoreBounds": true
  },
  "macos": { "bundleIdentifier": "com.example.myapp" }
}
```

Sizes are outer-frame logical dimensions. AppKit-specific chrome is grouped under `window.macos`, including `titleBar.trafficLights` and `backgroundMaterial`. Portable defaults stay in `window`; native startup behavior stays in `macos.lifecycle`.

Spark owns identity, windows, document associations, update signing, helper bundles, and desktop lifecycle policy. Expo settings/plugins go in `expo` or `expoByPlatform.<target>`. Custom native settings may require an app-specific binary.

`@legendapp/spark/config` exports typed configuration/readers. `toExpo` validates untrusted Spark JSON. The schema supports editor checks; runtime validation also checks target, size, helper-path, and update relationships.

## Existing Expo apps

From a prepared local SDK checkout:

```sh
npm run spark -- add desktop --project /absolute/path/to/ExistingExpoApp
```

The integration checks the installed Expo `54.0.37`, React Native `0.81.6`, and React `19.1.4` baseline before editing. Upgrading an incompatible app is separate work. It preserves the entry point, source, existing mobile/web scripts, and mobile native projects. Existing desktop script names are preserved, using `spark:macos`/`spark:windows` when needed.

Expo remains the source for app name/version and shared settings. The sidecar declares `extends: "expo"`, stable identity, desktop platforms, and desktop options. `withSparkExpo` from `/expo-config` composes the existing config; ordinary Expo commands retain their mobile/web meaning. Spark commands select the desktop/shared session environment automatically.

Review generated integration files and run the app's existing checks. Automatic config composition has restrictions on export shapes, module format, and Metro/native config filenames. Existing desktop projects need explicit host composition. See [the integration guide](https://github.com/LegendApp/legend-spark/blob/main/docs/add-desktop.md); preserving an Expo Router entry does not establish desktop Router support.

## Metro and native discovery

Retain the generated wrappers and apply application customizations through them. For a Spark-owned project:

```js
// metro.config.js
const { metroConfig } = require('@legendapp/spark/metro');
module.exports = metroConfig(__dirname);
```

```js
// react-native.config.js
module.exports = require('@legendapp/spark/native').nativeConfig(__dirname);
```

For an existing Expo project, compose its configuration:

```js
const { getDefaultConfig, withSparkMetro } = require('@legendapp/spark/metro');
const config = getDefaultConfig(__dirname);
module.exports = withSparkMetro(config);
```

`withSparkNative(existingConfig, __dirname)` preserves app assets and native settings. `withSparkMetro` accepts asynchronous wrappers as well. `/expo-metro` and `/universal` were removed; use `/metro`.

## Native lifecycle

The standard Spark AppDelegate owns React bootstrap and app event dispatch. `macos.lifecycle.mainWindow` can configure initial visibility, close behavior, and reopen policy. Native packages can opt into startup plugins and asynchronous quit handlers without replacing the app delegate. Link/include a plugin that must survive production pruning.

A hidden main window keeps the runtime alive; it does not make the app menu-bar-only. Runtime close/quit guards and [document coordination](/spark/documents) own asynchronous application decisions. See [native lifecycle](https://github.com/LegendApp/legend-spark/blob/main/docs/host-migration.md) and [configuration details](https://github.com/LegendApp/legend-spark/blob/main/docs/configuration.md).


## development

<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

`npm run dev`, `npm start`, and the generated desktop scripts enter one managed Expo CLI development session. Expo owns Metro, logs, reload, debugging, and mobile/web actions; Spark adds desktop runtime selection and compatibility checks.

## Terminal actions

| Key | Action |
| --- | --- |
| `d` | Open the host desktop target |
| `g` | Switch Spark Runner/custom development build without compiling |
| `b` | Build and open a required custom development binary |
| `r`, `j`, `m` | Expo reload, debugger, and development menu |
| `i`, `a`, `w` | Declared iOS, Android, and web targets |
| `s` | Mobile Expo Go/development-client selection |
| `?` | Current command table |
| Ctrl+C | Exit the session and close its owned native app |

Expo Go is a mobile runtime; it is separate from Spark Runner. Switching binaries or restarting Metro can reset React state. Desktop selection is remembered in `.spark/settings.json`.

A universal session serves all declared targets. A missing/incompatible desktop binary blocks that desktop bundle while mobile/web remain available. `--platform` chooses an initial launch; it does not add a platform to the project.

```sh
npx --no-install spark dev --no-open
npx --no-install spark dev --platform ios
npx --no-install spark dev --port 8082 --localhost
```

Expo start flags such as `--clear`, `--offline`, `--lan`, `--tunnel`, and `--max-workers` pass through. Use `spark dev --help` for the full list. Desktop launch uses the port Expo reports.

## Native changes

Extra native modules, URL/document associations, helper binaries, or native settings/plugins can require an app-specific build. Spark checks native requirements before loading JavaScript; it does not automatically compile every edit.

```sh
npx --no-install spark build --dev --platform macos
# On Windows:
npx --no-install spark build --dev --platform windows
```

`build --dev --force` forces regeneration and compilation. Author durable native changes in packages/config plugins; generated native directories are disposable. Run native generation/build operations sequentially in one checkout.

To select Intel macOS from a consumer project:

```sh
SPARK_MACOS_ARCH=x64 npx --no-install spark build --dev
SPARK_MACOS_ARCH=x64 npx --no-install spark dev
```

`SPARK_MACOS_ARCH=arm64|x64` and `SPARK_WINDOWS_ARCH=x64|arm64` select build targets. The matching architecture is part of runtime compatibility. Selecting an architecture does not establish native acceptance or supply a missing hosted Runner.

## Production selection

```sh
npx --no-install spark analyze
npm run build
```

Analysis records production reachability in `.spark/selection-report.json`. SDK native modules can be pruned; unknown third-party native dependencies are retained. Keep native-only requirements in configuration. `build --preview` uses the production native selection in Debug; it is distinct from the standalone embedded-bundle build.

## SDK iteration and diagnostics

Repack after SDK source changes and rebuild/register a Runner when its native signature changes. From the framework checkout, `node scripts/refresh-consumer.ts /path/to/app` refreshes a local test consumer's SDK archives. Content-hashed archives avoid stale package-manager cache identities. Use real packed consumers for distribution checks.

`spark doctor` diagnoses native prerequisites. Generated diagnostics live under `.spark/`: command records, full build logs, native selection, compatibility session state, and product/fingerprint records. Keep those outputs out of version control.

See [configuration](/spark/configuration), [examples and validation](/spark/examples), and the [SDK development guide](https://github.com/LegendApp/legend-spark/blob/main/docs/development.md).


## distribution

<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

## Build and package a macOS app

From the generated app:

```sh
npm run build
npx --no-install spark open
npm run package
```

`build` embeds JavaScript and the production-selected native graph in a local ad-hoc-signed `.app`. `package` signs a staging copy with Developer ID, notarizes it with your Keychain profile, and validates the distribution ZIP. It does not publish the application.

Signing requires installed credentials, full Xcode tooling, and a notarization profile. First use can configure credentials. Keep signed archives and submission state until Apple's outcome is known. Resume/recover a pending submission through the documented packaging commands rather than starting a duplicate submission.

Intel targeting uses `SPARK_MACOS_ARCH=x64` for build/package, with matching native dependencies and helper binaries. That tooling does not establish Intel native or signed-distribution acceptance. Windows production/preview builds, signing/MSIX, Linux, and the Mac App Store workflow remain unsupported.

See [packaging details](https://github.com/LegendApp/legend-spark/blob/main/docs/packaging.md).

## Whole-app updates

`@legendapp/spark/updates` supplies native macOS whole-app update integration. It is not Expo-style JavaScript OTA updates. Runner/development/unconfigured hosts report explicit unavailability through `getUpdateStatus()`.

```ts
import { getUpdateStatus, checkForUpdates, onUpdateEvent } from '@legendapp/spark/updates';

const subscription = onUpdateEvent(event => {
  if (event.state === 'error') console.error(event.message);
  else if ('version' in event) console.log(event.state, event.version);
});
const status = await getUpdateStatus();
if (status.available && status.canCheck) {
  await checkForUpdates({ mode: 'interactive' });
}
subscription.remove();
```

Retain the subscription for the app/UI lifetime; the last line illustrates teardown. Checking resolves when initiated. Progress/completion arrives as typed events: checking/notAvailable, version-bearing available/downloading/downloaded/installing, or error with message.

`startUpdates` starts a configured updater. `configureUpdates({ automaticallyChecks?, checkIntervalSeconds? })` changes preferences; an empty object starts the configured updater without changing preferences. Feed/key configuration belongs to the native app and can require rebuilding.

Update build numbers must increase. The CLI validates a candidate against the feed and earlier local artifact; equal/backward numbers reject. Signed installation/relaunch and downgrade rejection need real release acceptance for the exact app and feed.

See [update configuration](https://github.com/LegendApp/legend-spark/blob/main/docs/desktop-integrations.md) and [release gates](/spark/limitations).

## Transfer a local SDK

From the framework checkout:

```sh
npm run spark -- sdk export /path/to/SparkSDK --runtime /path/to/SparkRunner.app
```

The transferable directory contains immutable package archives, checksums, an installer, and optional runtimes. `--runtime` can repeat. A Windows export includes the entire product directory with its DLLs. Exports refuse existing destinations and only publish output after validation.

On the recipient, preserve bytes, permissions, and symlinks, then:

```sh
cd /path/to/SparkSDK
node install.mjs
```

Use the installed CLI command printed by the installer. Installation verifies archives before installing/registering the SDK. Network access is still needed for third-party dependencies; checksums detect corruption but are not publisher signatures.

Keep the installed directory/runtime locations stable. Relocate before installation; moving an installed SDK requires reinstalling/refreshing app references. This workflow is useful for current-source testing and does not require public npm publication.

## SDK prereleases

The published package and hosted Runner must match one immutable SDK version. Source packing/registering/exporting does not publish artifacts. Preview assembly validates source/recipe provenance, patched native dependency receipts, checksums, architecture, signature, and notarization before the explicit publish step.

Do not substitute the old published Runner for changed local native signatures. Clean-recipient install/startup, target-specific behavior, signing, and update evidence remain separate release gates. See [SDK transfer](https://github.com/LegendApp/legend-spark/blob/main/docs/sdk-distribution.md) and [release process](https://github.com/LegendApp/legend-spark/blob/main/docs/releases.md).


## documents

<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

## Application lifecycle

`@legendapp/spark/app` supplies `getAppContext`, `activate`, `hide`, `quit`, `beforeQuit`, and typed app listeners. Context includes stable identity, native runtime information, and initial process arguments. `getAppAvailability()` is safe without the optional module.

```ts
import { beforeQuit } from '@legendapp/spark/app';
import { settings } from '@legendapp/spark/settings';

const guard = await beforeQuit(async () => {
  await settings.set('lastSession', { closedCleanly: true });
  return true;
}, { onError: console.error });

await guard.remove();
```

Keep the guard registered for the app-owned lifetime; the final line illustrates teardown. Register before enabling work that needs protection. Save/flush inside the guard. An approved quit can stop JavaScript before an awaiting continuation runs.

Every guard must approve. False, rejection, the native 30-second deadline, or guard changes during a decision vetoes that attempt. `quit()` joins a pending request and reports `quitRequested`, with `reason: 'vetoed'` on refusal. Forced process termination cannot be vetoed. `willQuit` is a live notification, not an asynchronous cleanup boundary.

App listeners report activation/deactivation, reopen, second-instance arguments, and logical window registry changes. They return synchronous subscriptions. Use `/windows` listeners for one native window lifetime. `finishWindowRestoration()` completes the macOS startup-shell restoration coordinator after restored roots are opened.

## Open requests and recent history

Use `@legendapp/spark/app/documents` for file/URL launch requests and recent documents:

```ts
import {
  subscribeToOpenRequests,
  noteRecentDocument,
  getRecentDocuments,
} from '@legendapp/spark/app/documents';

const subscription = await subscribeToOpenRequests(request => {
  if (request.type === 'file') console.log(request.path);
  else console.log(request.url);
});
await noteRecentDocument('/absolute/path/to/Notes.txt');
const recent = await getRecentDocuments();
subscription.remove();
```

`OpenRequest` discriminates `{ type: 'file', id, path }` from `{ type: 'url', id, url }`. File paths are decoded once; avoid manually interpreting them as URLs. Recent history is project-scoped; native OS history integration depends on the host.

Registration installs the live listener before replaying up to 100 retained native requests and deduplicates replay/live overlap. Each new subscription can replay requests again. Exactly-once import policy across controller lifetimes belongs to the app.

`/links` separately retains Expo-shaped URL methods and live URL events. Those listeners exclude file-open events and launch replay.

## Document coordination

`createDocumentAppController` owns menu/listener setup, initial opening, reopen requests, document delivery, and selected logical-window state. Its handle exists immediately; await `ready` for setup. Use `onOpenDocument(path, controller)` for file requests, and `reportError` for application callbacks. `updateMenus`, state getters/setters, and `subscribe` support application services outside React.

Await `controller.remove()` at its ownership boundary, including after setup failure. Removal waits for setup/native cleanup, but does not cancel application callbacks already running. Failed cleanup remains retryable.

`useDocumentAppController` returns loading/ready/error state, keeps callbacks current, and owns removal on unmount. `onCleanupError(error, controller)` exposes failed cleanup for retry.

`watchDocumentReload` owns a debounced file watcher, serializes reloads, and waits for an active reload during removal. Its React adapter is `useWatchedDocumentReload`. Supply `onError`; do not await watcher removal inside the reload it is waiting for.

See [app lifecycle](https://github.com/LegendApp/legend-spark/blob/main/docs/app.md) and [document coordination](https://github.com/LegendApp/legend-spark/blob/main/docs/links-and-documents.md).


## examples

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


## files

<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

## Dialogs

`@legendapp/spark/dialogs` contains open/save panels, `showMessage`, and `confirm`. `/message-dialog` was removed. File panels use `defaultPath` and labeled extension filters:

```ts
import { openFileDialog } from '@legendapp/spark/dialogs';
import { readText } from '@legendapp/spark/files';

const result = await openFileDialog({
  windowId: 'main',
  selection: 'files',
  multiple: false,
  defaultPath: '/absolute/path/to/documents',
  filters: [{ name: 'Text documents', extensions: ['txt', 'md'] }],
});
if (!result.canceled) {
  const text = await readText(result.paths[0]);
  console.log(text);
}
```

An owner is optional; a supplied `windowId` must identify a live window. Open returns `{ canceled: true }` or `{ canceled: false, paths }`. Save returns the same cancellation discriminant with one `path`; it can accept `defaultName`. Extensions omit dots; MIME types/UTIs are unsupported. Windows displays labeled groups; macOS combines extensions and ignores group labels. Mixed file/directory selection is explicitly macOS-specific.

Message buttons have stable IDs and labels. `showMessage` returns `buttonId` (null on host dismissal), and includes `checked` only when a checkbox was supplied. `confirm` returns a boolean. Missing modules, bad options, and native failures are errors rather than fabricated cancellation.

## Native file IO

`@legendapp/spark/files` owns asynchronous desktop operations. Paths are absolute native paths or local `file://` URLs decoded once. Nonlocal file URLs, query strings, and fragments reject. Bytes use `Uint8Array`.

Use `getDirectory('data')` for project-scoped storage, `list` for immediate children, `stat` for metadata, `readText`/`writeText` for UTF-8, and `readBytes`/`writeBytes` for binary content. `stat` describes a symlink itself; invalid UTF-8 and permission failures reject.

`copy(source, destination, { overwrite? })` and `move` reject existing destinations by default. Explicit overwrite replaces them. Directory copy is recursive; cross-volume move may copy then delete. Neither is a transaction across multiple files.

Whole-file writes replace atomically on supported backends. `writeTextIfUnchanged` compares observed text and returns `{ written: false }` on conflict; it is not a cross-process compare-and-swap. `remove` defaults to nonrecursive removal; missing paths succeed. `trash` rejects if recycling is unavailable and never falls back to permanent deletion. `revealInFileManager` is distinct from `/links` opening a file in its associated application.

## Bounded streams and handles

```ts
import { getDirectory, readChunks } from '@legendapp/spark/files';

const path = `${await getDirectory('data')}/large.bin`;
for await (const bytes of readChunks(path)) {
  console.log(bytes.byteLength);
}
```

`readChunks`/`writeChunks` avoid loading an entire file. Iteration closes ownership on completion, error, cancellation, or an early loop exit. `openFile` exposes positional read/write, `flush`, and `close`. Streaming/positional writes can be partial; inspect the [streaming contract](https://github.com/LegendApp/legend-spark/blob/main/docs/file-streams.md).

Close stops accepting new work, joins pending cleanup, and permits retry after native cleanup failure. File cleanup errors can expose retained handles rather than losing ownership.

## Watching and scanning

`watch(path, listener, { recursive })` resolves an async registration. Notifications invalidate cached data; re-read the path. They can coalesce and do not form an exact add/delete journal. Recursive watches require a directory. Await removal.

`scanFiles(paths, options)` is operation-scoped and currently macOS-only. Batches/progress belong to that invocation; concurrent scans do not share singleton callbacks. Results include totals and partial traversal errors. Abort stops between filesystem operations and rejects with `E_ABORTED` after native work stops; a pending OS call is not interrupted. Check `getFileScanAvailability()` when presenting this feature.

All file helpers, scanning, and watching share `/files`. See [the complete file guide](https://github.com/LegendApp/legend-spark/blob/main/docs/files.md).


## getting-started

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


## index

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


## integrations

<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

## Clipboard, links, and drag/drop

`/clipboard` retains selected Expo-shaped `getStringAsync`, `setStringAsync`, and `hasStringAsync` methods. `setStringAsync` returns the actual boolean write result. Rich `readClipboard`/`writeClipboard` use owned payloads; file lists are separate from text/image alternatives. Raw format identifiers come from `getClipboardFormats`.

`/links` supplies `openURL`, `canOpenURL`, `getInitialURL`, and `addEventListener('url', listener)`. Desktop `openPath` opens a native file with its associated application. File/URL launch replay and recent history live under [/app/documents](/spark/documents).

`/drag-drop` handles generic files/text/URLs/custom MIME payloads with consumer-facing events and explicit operations/coordinates. Application-specific music/track models do not belong in the SDK. Use availability and `onError` rather than assuming every import has a native backend.

## Local notifications

```ts
import { requestNotificationPermission, showNotification } from '@legendapp/spark/notifications';

const permission = await requestNotificationPermission();
if (permission.granted) {
  await showNotification({
    id: 'import-complete',
    content: {
      title: 'Import complete',
      body: 'Your files are ready.',
      sound: 'message',
      actions: [{ id: 'view', label: 'View files' }],
    },
  });
}
```

Request permission from an explicit user action. Windows reads OS settings without an in-app permission prompt. OS acceptance does not guarantee presentation.

`showNotification` is immediate; `scheduleNotification` adds `{ type: 'delay', delaySeconds }`. Content supports silent/default sound or portable `message`, `mail`, `reminder`, `call`, and `error` tones. One to four action buttons report their IDs through responses. macOS banners show the first two; Notification Center can show the rest.

`onNotificationResponse` installs live delivery and drains retained launch responses. Await setup; the returned subscription removes synchronously. Responses identify the notification and `open`, `dismiss`, or a custom action. New subscriptions can replay retained responses.

`cancelNotification`/`cancelAllNotifications` remove pending delivery. `dismissNotification`/`dismissAllNotifications` remove already delivered notifications. List APIs distinguish those sets. These are local notifications, not push tokens or background tasks.

## System integration

`/system` supplies system information, events, login startup, badges, attention, sleep prevention, and explicit Dock/taskbar menu registration. Events are invalidations: query `getSystemInfo()` again for current values. `requestAttention` and `preventSleep` return owned async registrations. Remove them when the application no longer needs the effect. Unsupported options reject; menu trees follow [surface restrictions](/spark/menus).

## Processes and helper executables

```ts
import { runCommand } from '@legendapp/spark/processes';

const result = await runCommand({
  target: { type: 'command', name: 'git' },
  args: ['--version'],
  timeoutMs: 10_000,
});
if (result.exit.type === 'exited' && result.exit.code === 0) {
  console.log(new TextDecoder().decode(result.stdout));
}
```

Targets discriminate PATH commands, absolute executables, and configured helper references. Arguments bypass a shell. Input/output use strings or byte arrays; output callbacks carry `Uint8Array` with arbitrary chunk boundaries. Results retain stdout/stderr, exit/termination, timeout, abort, and truncation. Nonzero exit is a result; an operational failure rejects.

`spawn` returns an owned handle with write, closeInput, terminate, and exited. Await writes for backpressure. Termination joins concurrent calls and waits for the process tree/output streams. It can be retried after native cleanup failure.

Helpers are target-specific executables supplied by the app under `desktop.config.json.helpers`. Spark packages their assets/dependencies but does not compile them or supply Node. Helpers require a custom binary. Keep shared process ownership in an application service, rather than each window. They are not persistent OS services; abrupt macOS app death does not guarantee cleanup. See [helper processes](https://github.com/LegendApp/legend-spark/blob/main/docs/sidecars.md).

## SQLite

```ts
import { openDatabase } from '@legendapp/spark/sqlite';

const database = await openDatabase('notes.sqlite');
try {
  await database.transaction(async tx => {
    await tx.run('CREATE TABLE IF NOT EXISTS notes (title TEXT NOT NULL)');
    await tx.run('INSERT INTO notes (title) VALUES (?)', ['Hello']);
  });
  const note = await database.getFirst('SELECT title FROM notes LIMIT 1');
  console.log(note);
} finally {
  await database.close();
}
```

The project-scoped filename must be a simple `.sqlite` name. Spark owns `Database`, `SqlExecutor`, row/value types, and run results; it does not expose OP-SQLite's raw DB. Use `tx` inside transactions. Success commits, rejection rolls back; direct connection operations during a transaction and nested transactions reject.

Blobs are `Uint8Array`; SQL NULL is null. Default integer mode rejects unsafe integer reads. `{ integers: 'text' }` permits out-of-range values as text, but an already rounded native number cannot recover exact digits. Use SQL `CAST(column AS TEXT)` when exact large integers matter. Close waits for accepted work and blocks new work.

## WebView

`/webview` exports an owned `WebView` component, props, events, and ref subset. Source is a URI with optional headers **or** inline HTML with optional `baseUri`. Normal React Native view props are supported; document content comes from source, not children.

Refs request reload/back/forward, string messaging, or script injection; they do not promise navigation completion. Load/HTTP errors and navigation/message payloads are typed. Navigation interception is synchronous where emitted and is not a network security boundary. Consult platform limits for origins, headers, scripts, cookies, and popup behavior; this is not the whole `react-native-webview` API.

## Audio and browser authentication

`createAudioPlayer(source, options?)` waits for readiness and returns async play/pause/seek/volume/metadata/status commands. Positions use seconds; creation supports timeout/abort. `useAudioPlayer` returns loading/ready/error state, with a player only when ready. Removal owns disposal; hooks handle replacement and late completion.

`createMediaSession` lets desktop/web publish controls for an external engine. One session owns system controls; stale handles cannot clear a newer session. Command callbacks request operations rather than confirming playback. Standalone external-engine sessions are unsupported on mobile, where Expo Audio owns its player controls. Browser playback may require a gesture. See [audio](https://github.com/LegendApp/legend-spark/blob/main/docs/audio.md).

`/auth-session` provides prepared state/redirect sessions, browser callback transport, and explicit dismissal. Success, cancellation, dismissal, and timeout remain distinct outcomes. Provider SDKs, token exchange, and credential policy belong to the app. This is not complete `expo-auth-session` compatibility. See [authentication](https://github.com/LegendApp/legend-spark/blob/main/docs/auth-session.md).

## Independent Hermes runtimes

Use `@react-native-runtimes/core` directly for background work in independent Hermes heaps inside the application process. Serialization, cleanup, native-module limits, and production reachability follow its integration guide. It is not Node or a persistent worker service. See [Runtimes](https://github.com/LegendApp/legend-spark/blob/main/docs/runtimes.md).


## limitations

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


## menus

<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

Spark menu items discriminate `type`, use stable IDs, and share label/disabled/checked semantics. Every surface accepts its own subset; shared types do not imply all native surfaces support submenus, roles, icons, or sliders.

## Application menus

```ts
import { createMenu } from '@legendapp/spark/menus';

const menu = await createMenu({
  id: 'editor',
  items: [{
    type: 'submenu', id: 'file', label: 'File', target: { menu: 'file' },
    items: [{ type: 'action', id: 'open', label: 'Open…', shortcut: 'CmdOrCtrl+O' }],
  }],
  onAction: event => { console.log(event.itemId); },
});
await menu.update({ items: [] });
await menu.remove();
```

Top-level items are submenus. Contributions merge by IDs, never translated labels. Later owners take precedence; removal restores earlier contributions/native items. Updates replace the owner's contribution. Native publication is acknowledged before create/update resolves. Failed publication retains the previous state; failed removal retains retryable ownership.

Targets bind native root menus, IDs, or macOS semantic roles. Role items dispatch through native responders; ordinary actions targeting roles dispatch to JavaScript. `useMenu` owns the same lifetime and exposes loading/ready/error state plus cleanup-error callbacks. Keep unchanged item structure stable; callback changes do not require republishing.

## Surface support

| Surface | Supported item shapes | Limits |
| --- | --- | --- |
| App menu | Recursive actions, checkboxes, separators, submenus; macOS roles | Windows role/icon requests reject |
| Context menu | Flat actions, checkboxes, separators | No submenus, roles, icons, shortcuts, or sliders |
| Tray menu | Actions, checkboxes, separators, recursive submenus | No roles, icons, shortcuts, or sliders |
| macOS toolbar popup | Actions, checkboxes, separators, numeric sliders | No submenus, roles, or shortcuts |
| macOS Dock | Recursive actions, checkboxes, separators, submenus | Restricted presentation/targeting fields |
| Windows taskbar | Flat actions and checkboxes | Disabled entries omitted; restricted fields |

`showContextMenu({ windowId, position, items })` requires an explicit owner. Position is logical top-left **content** coordinates, rather than display/outer-frame coordinates. Cancellation returns `{ canceled: true }`; selection returns `{ canceled: false, itemId }`. A concurrent popup rejects `E_BUSY`.

`createTray` returns a handle with `update` and async `remove`. Images distinguish SF Symbol names from local files; symbol images are macOS-specific. Dock/taskbar menu registrations live in `/system` and have separate native availability.

## Local and global shortcuts

```ts
import { registerShortcut } from '@legendapp/spark/shortcuts';

const shortcut = await registerShortcut('CmdOrCtrl+S', () => {
  console.log('Save requested');
}, { windowId: 'main' });
await shortcut.remove();
```

Local and global registration share portable accelerator parsing and async removal. Local options include window ownership and repeat behavior. `registerGlobalShortcut(accelerator, handler, { repeat? })` lives under `/global-shortcuts`. Windows supports repeat; requesting it on macOS rejects `E_UNSUPPORTED_OPTION`. Conflicts are failures, not silently replaced registrations.

## Commands and raw keys

`/shortcuts/commands` includes `createHotkeyRouter`, `createHotkeyStore`, optional React bindings, capture, and settings UI. Routers arbitrate enabled commands by window/application scope and priority. The store owns versioned JSON bindings, keeps portable `CmdOrCtrl` spelling, exposes conflicts, and requires flush/close for persistence. Its `/storage` alias was removed.

`/shortcuts/keyboard` supplies `addKeyboardListener`, key codes, and modifier helpers. Registrations have explicit ownership; callbacks observe native `consumed`/`captured` decisions and cannot consume a key by returning a value. The low-level backend/command router currently requires macOS. Native shortcut matching never waits synchronously for JavaScript.

See [menu details](https://github.com/LegendApp/legend-spark/blob/main/docs/menus.md) and [command routing](https://github.com/LegendApp/legend-spark/blob/main/docs/commands.md).


## migration

<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

The source API cleanup makes direct breaking changes. Removed exports have no compatibility aliases. First select a matching current-source SDK, refresh packed dependencies, and rebuild native runtimes whose signatures changed. The old published preview and current source are not interchangeable.

## Import changes

| Removed path | Current path |
| --- | --- |
| `/message-dialog` | `/dialogs` |
| `/windows/react`, `/windows/managed`, `/windows/controls` | `/windows` |
| `/app/exit` | `/app` |
| `/app/recent-documents` | `/app/documents` |
| `/files/scanner`, `/files/watchers`, general `/settings/paths` helpers | `/files` |
| `/shortcuts/commands/storage` | `/shortcuts/commands` |
| `/settings/window/options` | `/settings/window` |
| `/processes/commands` | `/processes` |
| `/drag-drop/views` | `/drag-drop` |
| `/ui/select-controls` | `/ui` |
| `/expo-metro`, `/universal` | `/metro` |

All paths use the `@legendapp/spark` prefix. The singleton `/global-shortcuts/hotkeys` interface was removed; use owned accelerator registrations or explicit keyboard APIs. Application-specific music drag payloads and chrome presets belong in app code.

## Behavior changes to review

- **Windows:** pass explicit IDs; use unified open options/results, display-relative outer-frame geometry, instance-bound listeners/guards, and grouped `macos` chrome. Animate through `setWindowBounds` in `/windows`.
- **Documents/app:** use typed file/URL requests with bounded replay; quit/close approval belongs in async guards. Save before approving shutdown.
- **Dialogs/files:** branch on cancellation discriminants; message buttons use IDs and checkbox state is optional. File dialogs use `defaultPath` and extension filters. Copy/move require explicit overwrite; file watches invalidate rather than report an exact change journal.
- **Settings:** validate persisted values with decoders. Observable factories are async and expose readiness, `value$`, `error$`, flush and close. General paths/IO moved to files.
- **Clipboard/secure storage:** use selected Expo-shaped methods; duplicate facades were removed. Clipboard string writes return a boolean, secure missing reads return null.
- **Menus/system/tray:** use typed items appropriate to each surface and owned create/update/remove registrations. Unsupported item shapes reject before publication.
- **Notifications/updates:** separate content/trigger and pending/delivered operations. Native update checking acknowledges initiation; typed events report later progress.
- **Processes/audio/auth:** retain owned resource handles, explicit result states, byte IO, cleanup and supported cancellation. Audio hooks return loading/ready/error, not an immediate backend player.
- **SQLite/WebView:** use Spark-owned database/component/ref types rather than raw OP-SQLite/WebView backend types.
- **UI:** controlled `TextInput.value` is supported; `value`/`defaultValue` are exclusive. Select/SegmentedControl share controlled values. Split panes are named, Sidebar selection requires its callback, and glass/symbol components have explicit native limits.

A callable operation or resolved import does not prove platform availability. Unknown options reject. Await async cleanup and retain failed handles for retry; a global clear-all operation is not a substitute for ownership.

## Configuration and tooling

The tooling runs on Node 24.19.0+; Bun is optional. Use `npm run spark -- ...` in the framework checkout and `npx --no-install spark ...` in consumers. Runner commands are `sdk build-runner`, `build --runner`, and `dev --runner-binary`; old prebuilt/go command spellings are removed. Expo's `dev --go` still means mobile Expo Go.

Author Spark-owned desktop settings in `desktop.config.json`, preserve `projectId`, and compose existing Expo projects through `/expo-config`, `/metro`, and `/native`. Review generated templates/wrappers when updating local consumers. Old Frame native identities/data are not automatically migrated.

See the [export inventory](https://github.com/LegendApp/legend-spark/blob/main/docs/api-export-inventory.json), [final API review](https://github.com/LegendApp/legend-spark/blob/main/docs/api-final-review.md), and [rename guide](https://github.com/LegendApp/legend-spark/blob/main/docs/legend-spark-migration.md).


## overview

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


## reference

<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

Import application APIs from `@legendapp/spark/<feature>`. The single SDK archive includes private implementation modules; applications should not install or deep-import them. Hooks, imperative operations, and public types share their capability entry point.

## Capability entry points

| Public path | Responsibility | Guide |
| --- | --- | --- |
| `/app` | App context, events, activation, quit guards | [Documents and lifecycle](/spark/documents) |
| `/app/documents` | File/URL requests, recent history, document controllers and reload watches | [Documents](/spark/documents) |
| `/windows`, `/windows/macos` | Windows, displays, cursor, geometry, React roots, native macOS chrome | [Windows](/spark/windows) |
| `/menus`, `/context-menu`, `/tray` | Owned app menus, native popups and tray items | [Menus](/spark/menus) |
| `/shortcuts`, `/global-shortcuts`, `/shortcuts/commands`, `/shortcuts/keyboard` | Accelerators, command routing, persisted bindings and low-level keyboard events | [Menus and shortcuts](/spark/menus) |
| `/dialogs` | Open/save panels, message dialogs and confirmation | [Files and dialogs](/spark/files) |
| `/files` | Paths, directories, byte/stream/positional IO, watches, scanning, Trash | [Files](/spark/files) |
| `/settings`, `/settings/observable`, `/secure-storage` | JSON settings, Legend State persistence and selected SecureStore methods | [Settings](/spark/settings) |
| `/settings/window` | Normal/virtualized settings-window composition and options | [Native UI](/spark/ui) |
| `/clipboard`, `/links`, `/drag-drop` | Clipboard formats, external URLs/paths and generic drag payloads | [Desktop integrations](/spark/integrations) |
| `/notifications`, `/system` | Permissions/local notifications, Dock/taskbar, login startup and power | [Desktop integrations](/spark/integrations) |
| `/processes` | Child processes and app-supplied helper executables | [Desktop integrations](/spark/integrations) |
| `/sqlite`, `/webview` | Spark-owned database and embedded browser contracts | [Desktop integrations](/spark/integrations) |
| `/audio`, `/auth-session` | Async players/media sessions and prepared browser-auth sessions | [Desktop integrations](/spark/integrations) |
| `/updates` | Native whole-app update status, initiation, preferences and events | [Packaging and updates](/spark/distribution) |
| `/ui`, `/ui/uniwind`, `/ui/classnames` | Common native controls and optional styling integrations | [Native UI](/spark/ui) |
| `/ui/search`, `/ui/sidebar`, `/ui/split-view`, `/ui/glass`, `/ui/symbol` | Specialized macOS views | [Native UI](/spark/ui) |
| `/ai`, `/ai/codex` | Installed AI CLI execution and optional macOS Codex supervisor | [AI execution](/spark/ai) |
| `/contracts`, `/diagnostics` | Shared error/availability/resource types and explicit diagnostic utilities | [Shared contracts](#shared-contracts) |

An import resolving is not evidence of support on every OS. Feature-local availability, permission checks, and the [per-export matrix](https://github.com/LegendApp/legend-spark/blob/main/docs/release-support-matrix.md) describe different constraints.

## Shared contracts

Spark-owned commands generally resolve `void`; data has explicit result types. Expected cancellation, veto, and nonzero process exit are results. Operational failures reject with `SparkError`; branch on `code` rather than parsing messages. `cause` retains underlying failures. Availability is advisory and separate from permissions.

Unknown option keys reject with `E_UNSUPPORTED_OPTION`, including unknown keys whose value is `undefined`. Promise operations reject validation failures; synchronous utilities throw. Omission leaves update fields unchanged; `null` only clears declared nullable fields. Check each operation's merge/replace rules.

Subscriptions expose synchronous `remove()`. Async registrations resolve to a handle with asynchronous `remove()`. Resource-specific cleanup uses `close()`, `remove()`, `terminate()`, or `dismiss()` according to its meaning. Stop observing when the owner ends, await required cleanup, and retain failed handles for supported retry. Concurrent cleanup joins rather than starting duplicate removals. Hooks handle late setup completions and expose cleanup-error callbacks where applicable.

Time is explicit: `timeoutMs`/Unix timestamps use milliseconds; audio positions and notification delays use seconds. File/process bytes are `Uint8Array`. Native paths, URLs, and base64 are distinct data forms.

## Ecosystem boundaries

Spark owns the supported SQLite, WebView, audio, UI, and desktop contracts. Their backend objects stay private. Selected Clipboard, Linking, and SecureStore methods follow Expo semantics; that does not promise complete Expo-package compatibility.

Legend State observables, React Native, Runtimes, Uniwind, and other ecosystem libraries retain their own APIs. Use upstream imports for capabilities beyond Spark's subset and define resource ownership when mixing integrations.

## Tooling and metadata exports

These are not application runtime capabilities:

| Paths | Use |
| --- | --- |
| `/config`, `/schema.json`, `/config-plugin`, `/expo-config` | Typed configuration, schema and Expo composition |
| `/metro`, `/native` | Metro and native discovery |
| `/runtime-entry`, `/metro-gate`, `/init-template` | Generated-project runtime/bootstrap integration |
| `/cli` | CLI executable entry |
| `/package.json` | Package metadata |

This accounts for the source package's 51 export paths. Removed aliases have no forwarding exports; see [migration](/spark/migration). The repository's [API design rules](https://github.com/LegendApp/legend-spark/blob/main/docs/api-design.md) govern additions and backend replacement.


## settings

<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

## JSON settings

`@legendapp/spark/settings` exports the default project-scoped `settings` store and `createSettingsStore({ storage })`. Missing reads return `undefined`; stored JSON null stays null. Corrupt data is preserved and reported rather than silently repaired.

```ts
import { settings } from '@legendapp/spark/settings';

await settings.set('theme', 'dark');
const theme = await settings.get('theme', {
  decode(value) {
    if (value !== 'system' && value !== 'light' && value !== 'dark') {
      throw new Error('Invalid theme preference');
    }
    return value;
  },
});
```

A decoder validates persisted data before returning an application type. Sets snapshot finite JSON values. Operations serialize per key within one store, without cross-process or cross-store locking. An update callback must not await another operation on its own key/store.

Custom `SettingsStorage` adapters implement async `read`, `write`, and `remove`; keys and storage choice are explicit. General directories/path helpers live in `/files`, not `/settings/paths`.

## Observable persistence

`@legendapp/spark/settings/observable` is explicitly a Legend State integration. Legend State owns its observable model and React subscriptions.

```ts
import { createObservableFile } from '@legendapp/spark/settings/observable';
import { getDirectory, mkdir } from '@legendapp/spark/files';

const directory = `${await getDirectory('data')}/preferences`;
await mkdir(directory);
const preferences = await createObservableFile({
  path: `${directory}/count.json`,
  initialValue: 0,
  decode(value) {
    if (typeof value !== 'number') throw new Error('Expected a number');
    return value;
  },
  debounceMs: 300,
});
preferences.value$.set(1);
await preferences.flush();
await preferences.close();
```

Await the factory for loaded/decoded readiness. Missing files use the initial value; corruption/read/decode errors reject. Parent directories must exist, and the path includes its extension. `saveDefault: true` persists a missing default before readiness.

`flush` snapshots synchronously, including changes made in a Legend State batch, and acknowledges that snapshot behind earlier writes. Later mutations need another save. Automatic failures appear in `error$`; explicit flush/close rejects. Successful saves clear the error; retry policy belongs to the app.

`close` stops observing and flushes a final snapshot. Concurrent closes join; failed closes retry that snapshot. Later observable mutations are valid but no longer persisted. Await close inside a quit guard.

`createObservableSettings({ path, fields, ...options })` uses field defaults and required decoders. Defaults apply only to absent fields, present null reaches the decoder, and unknown fields are omitted. These integrations retain Legend State Date/Map/Set serialization; basic JSON settings do not acquire that larger contract. Multiple handles writing one file can overwrite each other.

## Secure storage

`@legendapp/spark/secure-storage` exposes the selected Expo SecureStore-shaped API, including `getItemAsync`, `setItemAsync`, `deleteItemAsync`, and `isAvailableAsync`. Missing values are null. Supported option/result semantics follow that subset; unsupported options reject.

The duplicate `secureStorage.get/set/remove` facade was removed. Native storage remains project-scoped; it is not an OS sandbox. Web secure storage is explicitly unavailable. Check availability and platform constraints rather than treating ordinary web storage as an equivalent secure backend.

See [settings details](https://github.com/LegendApp/legend-spark/blob/main/docs/settings.md) and [API contracts](https://github.com/LegendApp/legend-spark/blob/main/docs/api-contracts.md).


## ui

<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

## Common controls

Import `Button`, `TextInput`, `Select`, and `SegmentedControl` from `@legendapp/spark/ui`:

```tsx
import { useState } from 'react';
import { View } from 'react-native';
import { Button, TextInput, Select } from '@legendapp/spark/ui';

export function Preferences() {
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('system');
  return (
    <View>
      <TextInput value={name} onChangeText={setName} accessibilityLabel="Name" />
      <Select
        options={[
          { label: 'System', value: 'system' },
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
        ]}
        value={theme}
        onValueChange={setTheme}
        accessibilityLabel="Appearance"
      />
      <Button onPress={() => console.log({ name, theme })}>Save</Button>
    </View>
  );
}
```

Controls share `disabled`, `accessibilityLabel`, `testID`, layout `style`, `onError`, and a `ControlRef` supporting `measureInWindow`. Shared refs do not expose backend objects or a universal focus/text mutation API.

TextInput is single-line and supports either controlled `value` or uncontrolled `defaultValue`. Those modes are mutually exclusive; remount to switch modes/reset an uncontrolled field. Defaults initialize once. Controlled desktop edits acknowledge native event counts; mobile controlled editing uses React Native TextInput.

Select and SegmentedControl share unique string-valued options and controlled `value`/`onValueChange`. Labels may repeat; a missing selected value does not implicitly select the first option. A parent that declines a choice retains its current selection.

| Control | macOS | Windows | iOS | Android | Web |
| --- | --- | --- | --- | --- | --- |
| Button | AppKit | WinUI | Expo SwiftUI | Expo Compose | HTML button |
| TextInput | AppKit | WinUI | RN TextInput | RN TextInput | HTML input |
| Select | Popup | ComboBox | Menu picker | Inline choices | HTML select |
| SegmentedControl | Segmented control | Unsupported | Segmented picker | Inline choices | Button group |

`getControlAvailability` is synchronous. Missing/unsupported native controls report through `onError` (default console logging) and render a disabled fallback with current label/text. Invalid props throw during render. A fallback is not a functioning native control.

Mobile Button/Select use optional `@expo/ui@0.2.0-beta.9` with Expo 54; Compose requires a development build. Windows UI/native acceptance remains pending.

## Specialized macOS views

| Import | Contract |
| --- | --- |
| `/ui/search` | `TextInputSearch`, controlled/default input, explicit appearance, focus/blur/measurement ref |
| `/ui/sidebar` | Controlled nullable `selectedId`, required `onSelectionChange`, item-array or `SidebarItem` composition, typed context-menu coordinates |
| `/ui/split-view` | `SidebarSplitView` with named `sidebar`/`content` panes, grouped title-bar options and provisional/ready layout events |
| `/ui/glass` | `GlassView`, regular/clear styles and RN color tint; native effect requires macOS 26 |
| `/ui/symbol` | `SFSymbol`, Apple-specific symbol names, layout/accessibility props and missing-symbol errors |

These views have safe synchronous availability queries and `onError`. Unsupported hosts preserve ordinary layout/content and report the limitation. Split layout readiness comes from native events; initial metrics are hints. Zero pane dimensions remain zero. Older macOS retains GlassView children without the effect.

```tsx
import { SidebarSplitView } from '@legendapp/spark/ui/split-view';
import { View, Text } from 'react-native';

<SidebarSplitView
  sidebar={<View><Text>Navigation</Text></View>}
  content={<View><Text>Editor</Text></View>}
  titleBar={{ content: { height: 52, material: 'glass' } }}
  onResize={event => console.log(event.phase, event.contentX)}
/>
```

## Settings windows

`/settings/window` exports `SettingsWindow`, `VirtualizedSettingsWindow`, named props/pages, and `createSettingsWindowOptions`. Both use `{ id, title, render }` pages and an explicit `windowId`. Use controlled `selectedPageId`/`onSelectionChange` or mount-time `defaultPageId`, with one selection owner.

This composition requires `@legendapp/list` and macOS split-view support. It shows a hidden window only after layout/initial-scroll readiness. When native split view is unavailable, the fallback has no readiness event and the settings window stays hidden. Handle `onError`; check availability before selecting this composition for a target.

## Styling

`/ui/uniwind` exports the same four common controls with optional `className` integration. Classes shape layout around native controls; arbitrary OS chrome styling is not promised. Explicit style takes precedence. `/ui/classnames` is a library-specific `clsx`/`tailwind-merge` convenience.

Use ordinary React Native views/text for surrounding screens. Uniwind supports application theme choices `system`, `light`, and `dark`; theme persistence belongs to the app. Windows Appearance overrides update mounted WinUI controls through the native theme module.

See [UI contracts](https://github.com/LegendApp/legend-spark/blob/main/docs/ui.md) and [styling setup](https://github.com/LegendApp/legend-spark/blob/main/docs/styling.md). Router integration and a broad cross-platform component catalog remain outside the supported scope.


## windows

<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

Import imperative operations, React helpers, and types from `@legendapp/spark/windows`. Every command addresses an explicit logical window ID. `'main'` identifies the host-created main window; `openWindow` cannot recreate it.

```ts
import { openWindow, getWindow, showWindow, closeWindow } from '@legendapp/spark/windows';

await openWindow({
  id: 'inspector',
  component: 'Inspector',
  title: 'Inspector',
  size: { width: 480, height: 640 },
  show: false,
});
await showWindow('inspector', { focus: true });
const inspector = await getWindow('inspector');
const result = await closeWindow('inspector');
if (!result.closed) console.log('Close was vetoed');
```

Register `Inspector` with React Native's `AppRegistry` before this fragment runs. Window props must be JSON-serializable. Named windows are singletons: opening a live ID rejects `E_ALREADY_EXISTS`. Show/focus the existing window explicitly. IDs may be reused after closure; commands address the current live instance.

## Geometry and state

`getDisplays()` returns IDs, logical screen sizes, work areas, scale factors, and optional persistent identity. `getCursorPoint()` returns `{ displayId, x, y }`. `WindowBounds` is the **outer frame**, measured in logical units from the identified display's top-left corner. Work areas use that same coordinate system.

Use `setWindowBounds(id, bounds, options?)`, `centerWindow`, `setWindowOptions`, minimize/maximize/unmaximize, and `setWindowFullscreen` on the explicit owner. `WindowInfo` includes visibility, focus, minimized, **maximized**, fullscreen, and bounds. Maximized means macOS zoomed/Windows `IsZoomed`; bounds events can prompt a fresh state query.

On macOS, animated geometry uses the portable setter:

```ts
import { getWindow, setWindowBounds } from '@legendapp/spark/windows';

const window = await getWindow('inspector');
await setWindowBounds('inspector', {
  ...window.bounds,
  width: 600,
  height: 700,
}, { macos: { durationMs: 200 } });
```

Omitted update fields stay unchanged; nullable min/max constraints clear to supported defaults. Creation-only identity, component, kind, parent/modal settings, props, position, and restoration policy are not general updates.

## Events and close guards

`addWindowListener(id, type, listener, options?)` and `beforeWindowClose(id, handler, options?)` resolve async registrations. Their lifetime binds to the native instance, so a later window reusing the logical ID cannot inherit old listeners/guards. Await `remove()` on disposal. A guard permits closure only by returning `true`; rejection/false vetoes it. `closeWindow` reports `{ closed: true }` or `{ closed: false, reason: 'vetoed' }`.

`getWindowAvailability()` is a synchronous, safe capability query. It does not create a window or guarantee a subsequent operation succeeds.

## React roots and navigation

`WindowProvider` supplies ownership; `useWindowId()` reads it and throws outside a provider. `withWindowProvider` wraps an ordinary registered root. `useWindowFocusEffect` observes the owning root after React commits.

`createWindowsNavigator` registers named window components/loaders and returns typed `open`, `close`, `show`, `getId`, and `prefetch` operations. Lazy components load before native creation; failed loads remain retryable. A stable configured ID is shared by eager and lazy roots. This navigator is window coordination, not Expo Router integration.

`createPrimaryWindowLifecycle` is the imperative initial-open/reopen coordinator; `usePrimaryWindowLifecycle` owns it in an effect. [Document controllers](/spark/documents) add menus and file-open requests.

## macOS chrome

Use `macos.titleBar`, `macos.toolbar`, represented URI, window level, and startup split-view options for AppKit-specific presentation. Toolbar item kinds include buttons, popup menus, labels, search, and segmented controls. A symbol without a declared label stays icon-only.

`@legendapp/spark/windows/macos` exposes blur, toolbar text/search operations, and `addMacOSWindowListener` for title-bar/toolbar events. Toolbar popup events contain an `action` discriminating ordinary selection from `valueChanged`. Geometry animation stays in `/windows`.

See the [window contract](https://github.com/LegendApp/legend-spark/blob/main/docs/api-window-contract.md) for all option/event types and platform restrictions.
