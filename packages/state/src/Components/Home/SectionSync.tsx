import { observable } from "@legendapp/state";
import { Memo, useObservable } from "@legendapp/state/react";
import { Editor } from "shared/src/Components/Editor/Editor";
import { SectionTitle } from "./Components";

type Backend = "keel" | "supabase" | "firebase" | "crud";
const Backends: Record<Backend, { text: string; code: string }> = {
  keel: {
    text: "Keel",
    code: `
const { mutations, queries } = client.api

const messages$ = observable(syncedKeel({
    list: queries.listMessages,
    create: mutations.createMessages,
    update: mutations.updateMessages,
    delete: mutations.deleteMessages,
    // Persist data and pending changes locally
    persist: { name: 'messages', retrySync: true },
    // Sync only diffs
    changesSince: 'last-sync'
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
    // Persist data and pending changes locally
    persist: { name: 'messages', retrySync: true },
    // Sync only diffs
    changesSince: 'last-sync'
}))
  `,
  },
  firebase: { text: "Firebase", code: "firebase" },
  crud: { text: "CRUD", code: "crud" },
};

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

export const SectionSync = () => {
  const backend = useObservable<Backend>("supabase");

  return (
    <div className="!mt-20 max-w-3xl mx-auto">
      <SectionTitle
        text="💾 Powerful sync and persistence"
        description="Legend-State includes a powerful sync and persistence system that enables local-first apps with optimistic updates, retry mechanisms, and efficient diff-based syncing. It supports various storage and sync backends, making it easy to build robust, offline-capable applications."
      />

      <DemoSync backend={backend.get()} />
    </div>
  );
};
