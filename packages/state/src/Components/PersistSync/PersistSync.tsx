import { observable, syncState } from "@legendapp/state";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { Memo, Reactive, observer, useIsMounted } from "@legendapp/state/react";
import { configureObservableSync, syncObservable, synced } from "@legendapp/state/sync";
import { Box } from "shared/src/Components/Box";
import { Editor } from "shared/src/Components/Editor/Editor";
import { state$ } from "shared/src/state";

const PERSIST_SYNC_CODE = `
import { observable } from "@legendapp/state"
import { observer } from "@legendapp/state/react"
import { synced, configureObservableSync } from "@legendapp/state/sync"
import { ObservablePersistMMKV } from
    "@legendapp/state/persist-plugins/mmkv"
import { enableReactNativeComponents } from
    "@legendapp/state/config/enableReactNativeComponents"

// Enable the Reactive components, only need to do this once
enableReactNativeComponents()

// Setup global sync and persist configuration. These can be overriden
// per observable.
configureObservableSync({
    persist: {
        plugin: ObservablePersistMMKV
    },
    // Retry changes with exponential backoff
    retry: {
        infinite: true
    },
    // Persist pending changes and retry
    offlineBehavior: 'retry'
})

// Create a synced observable
const profile$ = observable(synced({
    // Get data from server
    get: () => fetch('https://reqres.in/api/users/1')
              .then(r => r.json())
              .then(r => r.data),

    // Send data to server on change
    set: async ({ update, value }) => {
        const result = await fetch(
            'https://reqres.in/api/users/1',
            { method: 'PUT', data: JSON.stringify(value) }
        ).then(r => r.json())

        const updatedAt = +new Date(result.updatedAt)
        // Update observable with updatedAt time from server
        update({ value: { updatedAt } })
    },

    // Persist in local storage
    persist: {
        name: 'persistSyncExample',
    },
    // Don't want to overwrite updatedAt
    mode: 'assign'
}))

const App = observer(function App() {
    const lastSync$ = syncState(profile$).lastSync
    const updatedAt = profile$.updatedAt.get() || 'Never'

    return (
        <Box>
            <Reactive.TextInput $value={profile$.first_name} />
            <Reactive.TextInput $value={profile$.last_name} />
            <Text>
                Saved: {updatedAt}
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
        .replace(/enableReactNativeComponents/g, "enableReactComponents")
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
        enableReactComponents,
        Reactive,
        Box,
        configureObservableSync,
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
              `<Reactive.input style={{ color: 'inherit' }} className="bg-white/10 text-inherit border rounded border-gray-500 px-2 py-1 mb-4 w-[140px]"`
            )
            .replace("enableReactNativeComponents", "enableReactComponents")
            .replace("ObservablePersistMMKV", "ObservablePersistLocalStorage")
            .replace("<Footer>", `<div>`)
            .replace("</Footer>", "</div>")
        )
      }
    />
  );
})
