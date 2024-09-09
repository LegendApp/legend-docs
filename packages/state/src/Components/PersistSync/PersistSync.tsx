import { observable, syncState } from "@legendapp/state";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { Memo, Reactive, observer, useIsMounted } from "@legendapp/state/react";
import { configureSynced, syncObservable, synced } from "@legendapp/state/sync";
import { syncedFetch } from "@legendapp/state/sync-plugins/fetch";
import { Box } from "shared/src/Components/Box";
import { Editor } from "shared/src/Components/Editor/Editor";
import { state$ } from "shared/src/state";

const PERSIST_SYNC_CODE = `
import { observable } from "@legendapp/state"
import { observer } from "@legendapp/state/react"
import { configureSynced } from "@legendapp/state/sync"
import { syncedFetch } from "@legendapp/state/sync-plugins/fetch";
import { ObservablePersistMMKV } from
    "@legendapp/state/persist-plugins/mmkv"

// Setup global sync and persist configuration. These can be overriden
// per observable.
const mySyncedFetch = configureSynced(syncedFetch, {
    persist: {
        plugin: ObservablePersistMMKV,
        retrySync: true // Persist pending changes and retry
    },
    retry: {
        infinite: true // Retry changes with exponential backoff
    }
})

// Create a synced observable
const profile$ = observable(mySyncedFetch({
    get: 'https://reqres.in/api/users/1',
    set: 'https://reqres.in/api/users/1',
    setInit: { method: 'PUT' },

    // Transform server data to local format
    transform: {
        load: (value, method) => method === 'get' ? value.data : value
    },

    // Update observable with updatedAt time from server
    onSaved: (result) => ({ updatedAt: new Date(result.updatedAt) }),

    // Persist in local storage
    persist: {
        name: 'persistSyncExample',
    },

    // Don't want to overwrite updatedAt
    mode: 'assign'
}))

const App = observer(function App() {
    const updatedAt = profile$.updatedAt.get();
    const saved = updatedAt ? new Date(updatedAt).toLocaleString() : 'Never'

    console.log(profile$.get())

    return (
        <Box>
            <Reactive.TextInput $value={profile$.first_name} />
            <Reactive.TextInput $value={profile$.last_name} />
            <Text>
                Saved: {saved}
            </Text>
        </Box>
    )
})
`;

export const PersistSync = observer(function PersistSync() {
    const framework = state$.framework.get();
    const replacer = (str: string) =>
      str
        .replace(/<Text/g, "<div")
        .replace(/<\/Text/g, "<\/div")
        .replace(/\/mmkv/g, "/local-storage")
        .replace(/ObservablePersistMMKV/g, "ObservablePersistLocalStorage")
        .replace(/TextInput/g, "input")
        .replace(/async-storage/g, "local-storage");

    const isMounted = useIsMounted().get();
    const displayCode = isMounted && framework === "React"
        ? replacer(PERSIST_SYNC_CODE)
        : PERSIST_SYNC_CODE;

  return (
      <Editor
          code={displayCode}
          scope={{
              observable,
              observer,
              Reactive,
              Box,
              syncedFetch,
              configureSynced,
              syncObservable,
              ObservablePersistLocalStorage,
              synced,
              syncState,
              Memo,
          }}
          noInline
          renderCode=";render(<App />)"
          previewWidth={180}
          transformCode={(code) =>
              replacer(
                  code
                      .replace(
                          /<Reactive\.(?:TextInput|input)/g,
                          `<Reactive.input style={{ color: 'inherit' }} className="bg-white/10 text-inherit border rounded border-gray-500 px-2 py-1 mb-4 w-[140px]"`,
                      )
                      .replace('ObservablePersistMMKV', 'ObservablePersistLocalStorage')
                      .replace('<Footer>', `<div>`)
                      .replace('</Footer>', '</div>'),
              )
          }
      />
  );
})
