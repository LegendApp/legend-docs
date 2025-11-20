[Supabase](https://www.supabase.com) and Legend-State work very well together - all you need to do is provide a typed client and the observables will be fully typed and handle calling the correct action functions for you.

## Full Example

We'll start with a full example to see what a full setup looks like, then go into specific details.

```ts
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'
import { observable } from '@legendapp/state'
import { configureSyncedSupabase, syncedSupabase } from '@legendapp/state/sync-plugins/supabase'
import { v4 as uuidv4 } from "uuid"

const supabase = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

// provide a function to generate ids locally
const generateId = () => uuidv4()
configureSyncedSupabase({
    generateId
})
const uid = ''

const messages$ = observable(syncedSupabase({
    supabase,
    collection: 'messages',
    // Optional:
    // Select only id and text fields
    select: (from) => from.select('id,text'),
    // Filter by the current user
    filter: (select) => select.eq('user_id', uid),
    // Don't allow delete
    actions: ['read', 'create', 'update'],
    // Realtime filter by user_id
    realtime: { filter: `user_id=eq.${uid}` },
    // Persist data and pending changes locally
    persist: { name: 'messages', retrySync: true },
    // Sync only diffs
    changesSince: 'last-sync'
}))

// get() activates and starts syncing
const messages = messages$.get()

function addMessage(text: string) {
    const id = generateId()
    // Add keyed by id to the messages$ observable to trigger a create in Supabase
    messages$[id].set({
        id,
        text,
        created_at: null,
        updated_at: null
    })
}

function updateMessage(id: string, text: string) {
    // Just set values in the observable to trigger an update to Supabase
    messages$[id].text.set(text)
}
```

## Set up Supabase types

The first step to getting strongly typed observables from Supabase is to follow their instructions to create a typed client.

https://supabase.com/docs/guides/api/rest/generating-types

The examples on this page will use the `supabase` client from the generated types:

```ts
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabase = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
```

## filter

By default it will use `select()` on the collection. If you want to filter the data, use the `filter` parameter. See the [Using Filters docs](https://supabase.com/docs/reference/javascript/using-filters) for details.

```ts
const messages$ = observable(syncedSupabase({
    supabase,
    collection: 'messages',
    // Filter by the current user
    filter: (select) => select.eq('user_id', 'uid')
}))
```

## select

By default it will use `select()` on the collection. If you want to be more specific, use the `select` parameter to customize how you want to select. See the [Select docs](https://supabase.com/docs/reference/javascript/select) for details.

You can also add filters here if you want.

```ts
const messages$ = observable(syncedSupabase({
    supabase,
    collection: 'messages',
    // Select only id and text fields
    select: (from) => from.select('id,text'),
    // Or select and filter together
    select: (from) => from.select('id,text').eq('user_id', 'uid')
}))
```

## actions

By default it will support create, read, update, and delete. But you can specify which actions you want to support with the `actions` parameter.

```ts
const messages$ = observable(syncedSupabase({
    supabase,
    collection: 'messages',
    // Only read and create, no update or delete
    actions: ['read', 'create'],
}))
```

## as

The shape of the observable object can be changed with the `as` parameter, which supports three options:

1. `object`: The default, an object keyed by the row's `id` field.
2. `Map`: A Map, which can be more efficient for accessing rows by key
3. `value`: Treat the result of a query as a single value like a `get`

Note that `array` is not an option because arrays make it hard to to efficiently and correctly add, update, and remove elements by id.

```ts
const messages$ = observable(syncedSupabase({
    supabase,
    collection: 'messages',
    as: 'Map'
}))

// messages$ is an observable Map
messages$.get('messageId').text.set('hello')
```

## Realtime

Enable realtime on the observable with the `realtime` option. This will update the observable immediately whenever any realtime changes come in. You can optionally set the `schema` and `filter` for the realtime listener.

See [Supabase's Realtime Docs](https://supabase.com/docs/guides/realtime/postgres-changes#available-filters) for more details about realtime filters.

```ts
const messages$ = observable(syncedSupabase({
    supabase,
    collection: 'messages',
    // Simply enable it
    realtime: true,
    // Or set options
    realtime: { schema: 'public', filter: `user_id=eq.${uid}`},
}))
```

## RPC and Edge Functions

You can override any or all of the default list/create/update/delete actions with an rpc or function call. There is just one requirement: create and update need to return either full row data or nothing, because the returned data is used to update the observable with any fields changed remotely (like updated_at).

One caveat is that Supabase's edge functions are not strongly typed so the observable can't infer the type from it.

```ts
const messages$ = observable(syncedSupabase({
    supabase,
    collection: 'messages',
    // Simply enable it
    realtime: true,
    // Use an rpc function for listing
    list: () => supabase.rpc("list_messages"),
    // Use an rpc function for creating
    create: (input) => supabase.rpc("create_country", input),
    // Or use functions
    list: () => supabase.functions.invoke("list_messages"),
}))
```

## Sync only diffs

An optional but very useful feature is the `changesSince: 'last-sync'` option. This can massively reduce badwidth usage when you're persisting list results since it only needs to list changes since the last query. The way this works internally is basically:

1. Save the maximum updatedAt to the local persistence
2. In subsequent syncs or after refresh it will list by `updated_at: lastSync + 1` to get only recent changes
3. The new changes will be merged into the observable

Enabling this on the Supabase side requires adding `created_at` and `updated_at` columns and a trigger to your table. You can run this snippet to set it up, just replace the two instances of YOUR_TABLE_NAME.

<Callout type="warn" title="Requires soft deletes">
It's not possible to list rows deleted in supabase to remove them from the local persistence, so you will have to use [soft deletes](#soft-deletes) described in the next session. If you don't need to delete you can remove that column from the script.
</Callout>

```sql
-- Add new columns to table named `created_at` and `updated_at`
ALTER TABLE YOUR_TABLE_NAME
ADD COLUMN created_at timestamptz default now(),
ADD COLUMN updated_at timestamptz default now(),
-- Add column for soft deletes, remove this if you don't need that
ADD COLUMN deleted boolean default false;

-- This will set the `created_at` column on create and `updated_at` column on every update
CREATE OR REPLACE FUNCTION handle_times()
    RETURNS trigger AS
    $$
    BEGIN
    IF (TG_OP = 'INSERT') THEN
        NEW.created_at := now();
        NEW.updated_at := now();
    ELSEIF (TG_OP = 'UPDATE') THEN
        NEW.created_at = OLD.created_at;
        NEW.updated_at = now();
    END IF;
    RETURN NEW;
    END;
    $$ language plpgsql;

CREATE TRIGGER handle_times
    BEFORE INSERT OR UPDATE ON YOUR_TABLE_NAME
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();
```

And to enable this feature in Legend-State, use the `changesSince` option and set the `fieldCreatedAt` and `fieldUpdatedAt` options to match the Supabase column names.

```ts
// Sync diffs of a list
syncedSupabase({
    supabase,
    collection: 'messages',
    persist: {
        name: 'messages'
    },
    // Enable syncing only changes since last-sync
    changesSince: 'last-sync',
    fieldCreatedAt: 'created_at',
    fieldUpdatedAt: 'updated_at',
    // Optionally enable soft deletes
    fieldDeleted: 'deleted'
})

// Or you can configure this optional globally so it will apply to every instance of syncedSupabase.
configureSyncedSupabase({
    changesSince: 'last-sync',
    fieldCreatedAt: 'created_at',
    fieldUpdatedAt: 'updated_at',
    // Optionally enable soft deletes
    fieldDeleted: 'deleted'
})
```

## Soft deletes

The delete parameter does not need to be an actual `delete` action in Supabase. You could also implement it as a soft delete if you prefer, just setting a `deleted` field to true. To do that you can provide `fieldDeleted` matching the field name in your table.

Then when you delete an element it will internally update the row with `{ deleted: true }` instead of deleting it, and the list action will remove deleted elements from the observable.

```ts
// Sync diffs of a list
syncedSupabase({
    supabase,
    collection: 'messages',
    fieldDeleted: 'deleted'
})
```

## Resource
- Local-first Realtime Apps with Expo and Legend-State [Blog](https://supabase.com/blog/local-first-expo-legend-state) - [Video](https://www.youtube.com/watch?v=68bM7TC9D1Q)
