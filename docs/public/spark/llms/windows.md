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
