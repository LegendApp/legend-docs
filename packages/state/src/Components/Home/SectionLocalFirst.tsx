import { useObservable } from "@legendapp/state/react";
import { synced } from "@legendapp/state/sync";
import { CodeSample } from "shared/src/Components/CodeSample";
import { SectionTitle } from "./Components";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

const CodeDemoPersist = `
const syncedState$ = observable(synced({
    persist: {
        plugin: ObservablePersistLocalStorage,
        name: 'messages',
        retrySync: true
    },
    // Sync only diffs
    changesSince: 'last-sync'
}))
`;

const DemoPersistence = () => {
  return <CodeSample code={CodeDemoPersist} scope={{synced, ObservablePersistLocalStorage}} />;
};

export const SectionLocalFirst = () => {

  return (
    <div className="!mt-20 max-w-3xl mx-auto">
      <SectionTitle
        text="💾 Local first is easy"
        description="All the hard parts of local first are built in."
      />
      <div className="!mt-16 flex">
        <div>
          <p>
            Web/mobile plugins for LocalStorage, IndexedDB, MMKV, Async Storage
          </p>
          <p>Or create your own plugins</p>
          <p>Sync only diffs</p>
          <p>Persist unsaved changes and retry</p>
        </div>
        <DemoPersistence />
      </div>
    </div>
  );
};
