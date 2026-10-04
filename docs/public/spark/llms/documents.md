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
