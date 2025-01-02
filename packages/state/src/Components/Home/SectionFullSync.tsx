import { observable } from '@legendapp/state';
import { Memo, observer, useObservable } from '@legendapp/state/react';
import { useMemo } from 'react';
import { Editor } from 'shared/src/Components/Editor/Editor';
import { TabsRounded } from '../Kit/TabsRounded';
import { Header } from './Header';
import { Text } from './Text';

const Backends = {
    keel: {
        text: 'Keel',
        code: `
const { mutations, queries } = client.api

const messages$ = observable(syncedKeel({
  list: queries.listMessages,
  create: mutations.createMessages,
  update: mutations.updateMessages,
  delete: mutations.deleteMessages,
  persist:
`,
    },
    supabase: {
        text: 'Supabase',
        code: `
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const messages$ = observable(syncedSupabase({
  supabase,
  collection: 'messages',
  select: (from) => from.select('id,text'),
  filter: (select) => select.eq('user_id', uid),
  realtime: { filter: \`user_id=eq.\${uid}\` },
  persist:
`,
    },
    firebase: {
        text: 'Firebase',
        code: `
const messages$ = observable(syncedFirebase({
  refPath: (uid) => \`/users/\${uid}/messages/\`,
  realtime: true,
  mode: 'merge',
  persist:
`,
    },
    crud: {
        text: 'CRUD',
        code: `
const messages$ = observable(syncedCrud({
  list: getMessages,
  create: createMessages,
  update: updateMessages,
  delete: deleteMessages,
  persist:
`,
    },
    query: {
        text: 'TanStack Query',
        code: `
const messages$ = observable(syncedQuery({
  queryClient,
  query: {
    queryKey: ['messages'],
    queryFn: async () => {
      return fetch('https://myurl/messages').then((v) => v.json())
    },
  },
  mutation: {
    mutationFn: async (variables) => {
      return fetch(
        'https://myurl/messages',
        { body: JSON.stringify(variables), method: 'POST' }
      )
    },
  },
  persist:
`,
    },
    fetch: {
        text: 'Fetch',
        code: `
const messages$ = observable(syncedFetch({
  get: 'https://myurl/messages',
  set: 'https://myurl/messages'
  persist:
`,
    },
    synced: {
        text: 'Synced',
        code: `
const messages$ = observable(synced({
  get: () =>
    fetch('https://myurl/messages').then((res) => res.json()),
  set: ({ value }) =>
    fetch('https://myurl/messages', { method: 'POST', data: JSON.stringify(value) })
  persist:
`,
    },
} satisfies Record<string, { text: string; code: string }>;

const Persistences = {
    LocalStorage: 'ObservablePersistLocalStorage',
    IndexedDB: 'ObservablePersistIndexedDB',
    MMKV: 'ObservablePersistMMKV',
    AsyncStorage: 'ObservablePersistAsyncStorage',
    ExpoSQLite: 'ObservablePersistSQLiteStorage',
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

const DemoSync = ({ backend, persistence }: { backend: Backend; persistence: Persistence }) => {
    const code = `${Backends[backend].code.replace('persist:', CodeDemoPersist(Persistences[persistence]).trim())}}))`;

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

export const SectionFullSync = observer(function SectionFullSync() {
    const backend$ = useObservable<Backend>('keel');
    const persistence$ = useObservable<Persistence>('LocalStorage');
    const backends = useMemo(() => Object.keys(Backends) as Backend[], []);
    const persistences = useMemo(() => Object.keys(Persistences) as Persistence[], []);

    return (
        <div className="mt-section max-w-3xl mx-auto sm:px-4">
            <div className="sm:border border-tBorder rounded-xl px-4 sm:px-8 md:px-12 py-8 md:py-12 !mt-8 sm:bg-tBgDark sm:shadow-tShadowDark">
                <Header size="h2" className="mb-4">
                    Local First with any backend
                </Header>
                <div>
                    <Text className="max-w-lg">
                        Use one of our ever-expanding library of sync plugins or build your own on top of the CRUD
                        plugin or the basic synced plugin.
                    </Text>
                    <Header size="h6" className="pt-8">
                        Backend
                    </Header>
                    <div className="flex gap-4">
                        <TabsRounded tabs={backends} tabText={(tab) => Backends[tab].text} $activeTab={backend$} />
                    </div>
                    <Header size="h6" className="!mt-8">
                        Persistence
                    </Header>
                    <div className="flex gap-4">
                        <TabsRounded tabs={persistences} $activeTab={persistence$} />
                    </div>
                </div>
                <div>
                    <DemoSync backend={backend$.get()} persistence={persistence$.get()} />
                </div>
            </div>
        </div>
    );
});
