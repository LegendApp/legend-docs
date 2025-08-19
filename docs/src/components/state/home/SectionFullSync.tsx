import { observable } from "@legendapp/state";
import { Memo, observer, useObservable } from "@legendapp/state/react";
import { Editor } from "./Editor";
import { useMemo } from "react";
import { Header } from "./Header";
import { Text } from "./Text";

const Backends = {
  keel: {
    text: "Keel",
    code: `
const { mutations, queries } = client.api

const messages$ = observable(syncedKeel({
  list: queries.listMessages,
  create: mutations.createMessages,
  update: mutations.updateMessages,
  delete: mutations.deleteMessages,
  persist:`,
  },
  supabase: {
    text: "Supabase",
    code: `
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const messages$ = observable(syncedSupabase({
  supabase,
  collection: 'messages',
  select: (from) => from.select('id,text'),
  filter: (select) => select.eq('user_id', uid),
  realtime: { filter: \`user_id=eq.\${uid}\` },
  persist:`,
  },
  firebase: {
    text: "Firebase",
    code: `
const messages$ = observable(syncedFirebase({
  refPath: (uid) => \`/users/\${uid}/messages/\`,
  realtime: true,
  mode: 'merge',
  persist:`,
  },
  crud: {
    text: "CRUD",
    code: `
const messages$ = observable(syncedCrud({
  list: getMessages,
  create: createMessages,
  update: updateMessages,
  delete: deleteMessages,
  persist:`,
  },
  fetch: {
    text: "Fetch",
    code: `
const messages$ = observable(syncedFetch({
  get: 'https://myurl/messages',
  set: 'https://myurl/messages'
  persist:`,
  },
} satisfies Record<string, { text: string; code: string }>;

const Persistences = {
  LocalStorage: "ObservablePersistLocalStorage",
  IndexedDB: "ObservablePersistIndexedDB",
  MMKV: "ObservablePersistMMKV",
  AsyncStorage: "ObservablePersistAsyncStorage",
};

const CodeDemoPersist = (persistence: string) => `
  // Persist locally
  persist: {
    plugin: ${persistence},
    name: 'messages',
    retrySync: true // Retry sync after reload
  },
  changesSince: 'last-sync' // Sync only diffs
`;

type Backend = keyof typeof Backends;
type Persistence = keyof typeof Persistences;

const DemoSync = ({
  backend,
  persistence,
}: {
  backend: Backend;
  persistence: Persistence;
}) => {
  const code = `${Backends[backend].code.replace(
    "persist:",
    CodeDemoPersist(Persistences[persistence]).trim()
  )}}))`;

  return (
    <Editor
      code={code}
      noInline
      renderCode={`;render(null)`}
      hideDemo
      noError
      showEditing={false}
      scope={{
        Memo,
        observable,
      }}
      classNameEditor="home-editor"
    />
  );
};

// Simple button-style tab selector
const SimpleTabSelector = ({ options, selected, onSelect, label }: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  label: string;
}) => (
  <div className="mb-4">
    <div className="text-sm font-medium text-white/60 mb-2">{label}</div>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
            selected === option
              ? 'bg-blue-700 border-blue-600 text-white'
              : 'bg-gray-800 border-gray-600 text-white/70 hover:bg-gray-700'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

export const SectionFullSync = observer(function SectionFullSync() {
  const backend$ = useObservable<Backend>("keel");
  const persistence$ = useObservable<Persistence>("LocalStorage");
  const backends = useMemo(() => Object.keys(Backends) as Backend[], []);
  const persistences = useMemo(
    () => Object.keys(Persistences) as Persistence[],
    []
  );

  return (
    <div className="mt-section max-w-3xl mx-auto sm:px-4">
      <div className="sm:border border-tBorder rounded-xl px-4 sm:px-8 md:px-12 py-8 md:py-12 !mt-8 sm:bg-tBgDark sm:shadow-tShadowDark">
        <Header size="h2" className="mb-4">
          Local First with any backend
        </Header>
        <div>
          <Text className="max-w-lg">
            Use one of our ever-expanding library of sync plugins or build your
            own on top of the CRUD plugin or the basic synced plugin.
          </Text>
          
          <div className="mt-6">
            <SimpleTabSelector
              label="Backend"
              options={backends}
              selected={backend$.get()}
              onSelect={(value) => backend$.set(value as Backend)}
            />
            
            <SimpleTabSelector
              label="Persistence"
              options={persistences}
              selected={persistence$.get()}
              onSelect={(value) => persistence$.set(value as Persistence)}
            />
          </div>
        </div>
        <div>
          <DemoSync backend={backend$.get()} persistence={persistence$.get()} />
        </div>
      </div>
    </div>
  );
});