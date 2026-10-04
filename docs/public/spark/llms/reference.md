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
