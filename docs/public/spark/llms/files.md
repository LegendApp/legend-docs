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
