import { observable } from "@legendapp/state";
import { Memo, observer, useObservable } from "@legendapp/state/react";
import { Editor } from "shared/src/Components/Editor/Editor";
import { SectionTitle } from "./Components";
import { useMemo } from "react";
import { TabsUnderlined } from "../Kit/TabsUnderlined";

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
}))
`,
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
}))
  `,
  },
  firebase: {
    text: "Firebase",
    code: `
const messages$ = observable(syncedFirebase({
    refPath: (uid) => \`/users/\${uid}/messages/\`,
    realtime: true,
    mode: 'merge',
}))
    `,
  },
  crud: {
    text: "CRUD",
    code: `
const messages$ = observable(syncedCrud({
    get: getMessages,
    create: createMessages,
    update: updateMessages,
    delete: deleteMessages,
}))
    `,
  },
  query: {
    text: "TanStack Query",
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
}))
    `,
  },
  fetch: {
    text: "Fetch",
    code: `
const messages$ = observable(syncedFetch({
    get: 'https://myurl/messages',
    set: 'https://myurl/messages'
}))
    `,
  },
  synced: {
    text: "Synced",
    code: `
const state$ = observable(synced({
    get: () =>
        fetch('https://url.to.get').then((res) => res.json()),
    set: ({ value }) =>
        fetch('https://url.to.set', { method: 'POST', data: JSON.stringify(value) }),
    persist: {
        name: 'test',
    },
}))
    `,
  },
} satisfies Record<string, { text: string; code: string }>; ;

type Backend = keyof typeof Backends;

const DemoSync = ({ backend }: { backend: Backend }) => {
  return (
    <Editor
      code={Backends[backend].code}
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

export const SectionSync = observer(function SectionSync() {
  const backend$ = useObservable<Backend>("keel");
  const backends = useMemo(() => Object.keys(Backends) as Backend[], []);

  return (
    <div className="!mt-20 max-w-3xl mx-auto">
      <SectionTitle
        text="💾 Powerful sync engine"
        description="Legend-State includes a powerful sync and persistence system that enables local-first apps with optimistic updates, retry mechanisms, and efficient diff-based syncing. It supports various storage and sync backends, making it easy to build robust, offline-capable applications."
      />
      <div className="!mt-16">
        <div>
          <div>
            Use one of the ever-expanding library of sync plugins or build your
            own on top of the CRUD plugin or the basic synced.
          </div>
          <div className="flex gap-4">
            <TabsUnderlined tabs={backends} tabText={(tab) => Backends[tab].text} $activeTab={backend$} tabPadding="pb-0" />
          </div>
        </div>
        <DemoSync backend={backend$.get()} />
      </div>
    </div>
  );
});
