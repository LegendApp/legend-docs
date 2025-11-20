## guides/patterns

## Many atoms vs. one large store

Legend-State can be used however you want. If your team prefers one large state object containing all app state, that's great! Or you may prefer to have multiple different individual atoms in their own files, which works too. Here's some examples of ways to organize your state.

### One large global state

```js
const store$ = observable({
    UI: {
        windowSize: undefined as { width: number, height: number },
        activeTab: 'home' as 'home' | 'user' | 'profile',
        ...
    },
    settings: {
        theme: 'light' as 'light' | 'dark',
        fontSize: 14,
        ...
    },
    todos: [] as TodoItem[]
})
```

### Multiple individual atoms

```js
// settings.ts
export const theme$ = observable('light')
export const fontSize$ = observable(14)

// UIState.ts
export const uiState$ = observable({
    windowSize: undefined as { width: number, height: number },
    activeTab: 'home' as 'home' | 'user' | 'profile',
})
```

### Within React components

You can use `useObservable` to create state objects within React components, then pass them down to children through either props or Context.

```js
function App() {
  const store$ = useObservable({
    profile: { name: "hi" },
  });

  return (
    <div>
      <Profile profile={store$.profile} />
    </div>
  );
}

function Profile({ profile }) {
  return <div>{profile.name}</div>;
}
```


## guides/performance

Legend-State is already quite optimized by default, but there are some things to keep in mind to make sure it's as optimized as possible.

## Batching

You may want to modify multiple observables at once without triggering callbacks for each change. Batching postpones renders and listeners until the end of the batch.

Batching can be done in two ways, wrapping between `beginBatch()` and `endBatch()` or in a callback with `batch(callback)`.

```js
import { batch, beginBatch, endBatch } from "@legendapp/state";

// Wrap in begin and end
beginBatch();
doManyChanges();
endBatch();

// Or batch with a callback
batch(() => {
  doManyChanges();
});
```

As we all know, you generally shouldn't optimize pre-emptively. `observable` functions like `assign` already batch changes under the hood, so listeners don't get called until the full change is complete. In many cases like setting unrelated observables you don't need to worry about it.

Batching is important in a few key situations:

### When observables depend on each other

Use `batch` to delay computations/renders until all dependent changes are complete or you might get weird intermediary states.

```js
const name$ = observable({ first: "", last: "" });

const fullName = computed(() => `${name$.first} ${name$.last}`);

observe(() => console.log("fullName = ", fullName.get()));

// Not batched:
name$.first.set("First");
name$.last.set("Last");
// ❌ fullName notifies its listeners with incomplete state
// fullName = "First "
// fullName = "First Last"

// Batched:
batch(() => {
  name$.first.set("First");
  name$.last.set("Last");
});
// ✅ fullName notifies only with final state
// fullName = "First Last"
```

### To prevent excessive renders

Making multiple changes in a row can cause the React hook to re-render multiple times when it should wait until changes are complete.

```js
const state$ = observable({ items: [] });

function addItems() {
  for (let i = 0; i < 1000; i++) {
    state$.items.push({ text: `Item ${i}` });
  }
}

// ❌ This can render 1000 times while pushing to the array
addItems();

// ✅ Batching delays until complete and renders once
batch(addItems);
```

### When persisting

If you are using `persistObservable` to automatically persist your changes, you can prevent excessive writes by delaying persistence until changes are complete. Pushing to an array 1000 times could save to storage 1000 times, which could be very slow!

## Iterating through observables creates Proxies

For most usage this effect is negligible, but may be a concern with huge arrays of objects.

Accessing objects/arrays in observables creates Proxies to give them the observable functions. If you are iterating through large objects that don't need to be tracked for changes, call `get()` first to access the raw data, skipping all the Proxy creation.

```js
const state$ = observable({ items: [{ data: { value: 10 }}, ...] })

let sum = 0

// 🔥 This will create proxies for each element's data and value
state$.items.forEach(item => sum += item.data.value.get())

// 💨 This will not do anything special
state$.items.get().forEach(item => sum += item.data.value)
```

## Arrays

Legend-State is especially optimized for arrays since it was built for [Legend](https://www.legendapp.com) to handle huge lists of data. Here are a few tips to get the best performance out of arrays.

### Arrays of objects require a unique id

To optimize rendering of arrays of objects, Legend-State requires a unique `id` or `key` field on each object. If your data needs to have a different id field, you can use a `${arrayName}_keyExtractor` function next to the array object:

```js
const data$ = observable({
  arr: [],
  arr_keyExtractor: (item) => item.idObject._id,
});
```

Under the hood, Legend-State listens to elements by path within the object. Operations like `splice` can change the index of an element which changes its path, so it uses the unique `id` to handle elements being moved and keep observables as stable references to their underlying element. It also optimizes for repositioning items within arrays and only re-renders the changed elements.

### Use the `For` component

The `For` component is optimized for rendering arrays of observable objects so that they are extracted into a separate tracking context and don't re-render the parent.

You can use it in two ways, providing an `item` component or a function as a child.

An `optimized` prop adds additional optimizations, but in an unusual way by re-using React nodes. See [Optimized rendering](#optimized-rendering) for more details.

```jsx
import { observable } from "@legendapp/state"
import { For } from "@legendapp/state/react"

const state$ = observable({ arr: [{ id: 1, text: 'hi' }]})

function Row({ item }) {
    return <div>{item.text}</div>
}
function List() {
    // 1. Use the For component with an item prop
    return <For each={state$.arr} item={Row} />

    // 2. Use the For component with a render function as the child
    return (
        <For each={list}>
            {item => (
                <div>
                    {item.text}
                </div>
            )}
        </div>
    )
}
```

### For doesn't re-render the parent

In this more complex example you can see that as elements are added to and update the array, the parent component does not re-render.

{/* TODO: Add TodosExample interactive component */}

### Don't get() observables while mapping

The `map` function automatically sets up a shallow listener, so it will only re-render when the array is changed and not when individual elements are changed. For best performance it's best to let the child component track each item observable.

Make sure that you don't access any observable properties while mapping, like accessing the id for the key, so use `peek()` to prevent tracking. If you do `get()` inside an `observer` component would trigger the outer component to observe every list element.

```jsx
import { observable } from "@legendapp/state";
import { For } from "@legendapp/state/react";

const state$ = observable({ arr: [{ id: 1, text: "hi" }] });

function Row({ item }) {
  return <div>{item.text}</div>;
}
function List() {
  // Be sure to use peek() to make sure you don't track any observable fields here
  return state$.arr.map((item) => <Row key={item.peek().id} item={item} />);
}
```

### Optimized rendering

The `For` component has an `optimized` prop which takes the optimizations even further. It prevents re-rendering the parent component when possible, so if the array length doesn't change it updates React elements in place instead of the whole list rendering. This massively reduces the rendering time when swapping elements, sorting an array, or replacing some individual elements. But because it reuses React nodes rather than replacing them as usual, it may have unexpected behavior with some types of animations or if you are modifying the DOM externally.

This is how the fast "replace all rows" and "swap rows" speeds in the [benchmark](../../intro/fast#benchmark) are achieved.

```jsx
import { For } from "@legendapp/state/react"

...

function List() {
    // Use the optimized prop
    return <For each={list} item={Row} optimized />
}
```


## guides/persistence

A primary goal of Legend-State is to make automatic persistence easy and very robust, as it's meant to be used to power all storage and sync of complex apps - it's the backbone of both [Legend](https://legendapp.com) and [Bravely](https://bravely.io). It's designed to support offline-first apps: any changes made while offline can be persisted between sessions to be retried in a future session when connected. To do this, the persistence system simply subscribes to changes on an observable, then on change goes through a multi-step flow to ensure that changes are persisted.

1. Save the pending changes to the metadata table in local persistence
2. Save the changes to local persistence
3. Save the changes to remote persistence
4. On remote save, set any needed changes (like dateModified) back into the observable
5. Clear the pending changes in the metadata table in local persistence

It also includes options to transform data in and/or out, and has event handlers for every step in the lifecycle.

```npm
npm install @legendapp/state
```

## persistObservable

`persistObservable` can be used to automatically persist an observable, both locally and remotely. It will be saved whenever you change anything anywhere within the observable, and the observable will be filled with the local state right after calling `persistObservable`.

The second parameter to `persistObservable` provides some options:

- `local`: A unique name for this observable in storage or options to configure it
- `pluginLocal`: The local persistence plugin to use. This defaults to use the globally configured pluginLocal.
- `remote`: Options to configure remote persistence
- `pluginRemote`: The persistence plugin to use. This defaults to use the globally configured pluginRemote.

`persistObservable` returns the observable with an additional `state` child that can be used to check it's loading state.

First you most likely want to set a global configuration for which plugins to use, though it can also be configured per observable.

## Local Persistence Plugins

First choose and configure the storage plugin for your platform.

### Local Storage (React)

```js
import { configureObservablePersistence } from '@legendapp/state/persist'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'

// Global configuration
configureObservablePersistence({
    pluginLocal: ObservablePersistLocalStorage
})
```

### IndexedDB (React)

```js
import { configureObservablePersistence } from '@legendapp/state/persist'
import { ObservablePersistIndexedDB } from '@legendapp/state/persist-plugins/indexeddb'

// Global configuration
configureObservablePersistence({
    pluginLocal: ObservablePersistIndexedDB
})
```

### MMKV (React Native)
```js
import { configureObservablePersistence } from '@legendapp/state/persist'
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv'

// Global configuration
configureObservablePersistence({
    // Use react-native-mmkv in React Native
    pluginLocal: ObservablePersistMMKV
})
```

### AsyncStorage (React Native)
```js
import { configureObservablePersistence } from '@legendapp/state/persist'
import { ObservablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'

// Global configuration
configureObservablePersistence({
    // Use AsyncStorage in React Native
    pluginLocal: ObservablePersistAsyncStorage,
    localOptions: {
        asyncStorage: {
            // The AsyncStorage plugin needs to be given the implementation of AsyncStorage
            AsyncStorage
        }
    }
})
```

Then call `persistObservable` for each observable you want to persist.

```js
import { observable } from "@legendapp/state";
import { persistObservable } from '@legendapp/state/persist'

const store$ = observable({ store: { bigObject: { ... } } })

// Persist this observable
persistObservable(store$, {
    local: 'store' // Unique name
})
```

### IndexedDB

The IndexedDB plugin can be used in two ways:

1. Persisting a dictionary where each value has an `id` field, and each value will create a row in the table
2. Persisting multiple observables to their own rows in the table with the `itemID` option

It requires some extra configuration for the database name, the table names, and the version.

IndexedDB requires changing the version whenever the tables change, so you can start with version 1 and increment the version whenever you add/change tables.

```js
import { observable } from "@legendapp/state";
import { configureObservablePersistence, persistObservable } from "@legendapp/state/persist"
import { ObservablePersistIndexedDB } from "@legendapp/state/persist-plugins/indexeddb"

configureObservablePersistence({
  pluginLocal: ObservablePersistIndexedDB,
  local: {
    indexedDB: {
      databaseName: "Legend",
      version: 1,
      tableNames: ["documents", "store"],
    },
  },
})

// Mode 1: Persist a dictionary
const state$ = observable({
  obj1: { id: "obj1", text: "..." },
  obj2: { id: "obj2", text: "..." },
})

persistObservable(state$, {
  local: "documents", // IndexedDB table name
})

// Mode 2: Persist an object with itemId
const settings$ = observable({ theme: "light" })

persistObservable(settings$, {
  local: {
    name: "store", // IndexedDB table name
    indexedDB: {
      itemID: "settings",
    },
  },
})
```

Because IndexedDB is an asynchronous API, you'll need to wait for it to load before you start reading from it. `persistObservable` returns an Observable with load statuses that you can wait for.

```js
const status = persistObservable(state$, {
    local: 'store' // IndexedDB table name
})
await when(status.isLoadedLocal)
...
```

### React Native

If you are on React Native you will need to install `react-native-mmkv` or `@react-native-async-storage/async-storage`, depending on which one you choose to use.

```npm
react-native-mmkv
```

```npm
@react-native-async-storage/async-storage
```

## Remote Persistence

Legend-State includes a few remote persistence plugins, and it's very easy to make a custom remote persistence plugin. When using the remote plugins there are some options that can be very useful.

- `transform`: Transform data as it loads in from the remote source or out as it saves to the remote source. You could use this to encrypt the data or transform it into some other format.
- `offlineBehavior`: `false` | `'retry'` determines whether to persist changes to retry them on the next load
- `onBeforeSet`: Called before saving to the remote
- `onGetError`: Called if load from remote fails
- `onSet`: Called after successful save to the remote
- `onSetError`: Called if save to remote fails
- `waitForGet`: A Promise or Observable to wait for before getting from remote
- `waitForSet`: A Promise or Observable to wait for before setting to remote
- `manual`: If true it will not get immediately, but will wait for you to call sync() on the returned syncState

Returns the observable itself along with a `state` child. Note that the `state` is not actually in the raw data and is only accessible through the observable.

```js
const { state } = persistObservable(settings, {
    pluginRemote: ...,
    remote: {
        transform: {
            in: (value) => decrypt(value),
            out: (value) => encrypt(value),
        },
        onSaveError: (err) => console.log(err),
    }
})
when(state.isLoaded, () => console.log('Loaded from remote'))
```

> This documentation is still under construction. The TypeScript types should hopefully be pretty clear for now, and we will update these docs soon!

### Generic remote persistence

All you need to make a remote persistence plugin is a `get` and a `set` function. You could use this to load/save each observable in a different way or build your own custom plugins.

- `get()`: Return a value or a Promise of a value
- `set({ value, changes })`: Save the value somewhere, return a Promise.

```js
import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist"

const obs$ = persistObservable(
  { initialValue: "hello" },
  {
    pluginRemote: {
      get: ({ onChange }) => {
        const getFn = () =>
          fetch("https://url.to.get").then((res) => res.json())

        // Set a timer to poll every 10 seconds
        setInterval(async () => {
          const value = getFn()
          onChange({ value })
        }, 10000)

        // Return the initial value
        return getFn()
      },
      set: async ({ value, changes }) => {
        await fetch("https://url.to.set", {
          method: "POST",
          body: JSON.stringify(value),
        })
      },
    },
  }
)
```

### Fetch plugin

Try it in a [sandbox](https://codesandbox.io/s/legend-state-persist-fetch-jl723s?file=/src/App.tsx).

```js
import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist"
import { persistPluginQuery } from "@legendapp/state/persist-plugins/query"

const state$ = observable({ name: '' })

persistObservable(state$, {
  pluginRemote: persistPluginFetch({
    get: 'https://url.to.get',
    set: 'https://url.to.set'
  })
})
```

### TanStack Query Plugin

`persistPluginQuery` includes all of the normal Query parameters, but instead of updates triggering a re-render, it updates an observable. The queryKey can be a function that returns a key array dependent on some observabes. If those observables change it will update the queryKey and re-run with the new key. That makes it super easy to do pagination, for example.

Try it in a [sandbox](https://codesandbox.io/s/legend-state-persist-query-dh4j59?file=/src/App.tsx).

```js
import { observable } from "@legendapp/state"
import { persistObservable } from "@legendapp/state/persist"
import { persistPluginQuery } from "@legendapp/state/persist-plugins/query"
import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient();

const page$ = observable(1)

const obs$ = persistObservable(
  { initialValue: "hello" },
  {
    pluginRemote: persistPluginQuery({
      queryClient,
      query: {
        // queryKey is a computed function that updates the query when page$ changes
        queryKey: () => ["key", page$.get()],
        queryFn: () => {
          return fetch("https://url.to.get?page=" + page$.get()).then((res) =>
            res.json()
          )
        },
      },
    }),
  }
)
```

### Firebase Realtime Database Plugin

The Firebase Realtime Database plugin has some extra options. The only required option is `refPath` which is the ref path in the database. It also has some other useful options:

- `refPath`: Given the user's UID (if available) return a string of the Firebase path
- `requireAuth`: Wait until we have an active Firebase Auth user before loading
- `query`: Given the reference to the refPath, you can adjust it further
- `mode`: "once" | "realtime" - defaults to "realtime". "once" gets the value once and does not setup any listeners.

```js
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage"
import { ObservablePersistFirebase } from "@legendapp/state/persist-plugins/firebase"
import { persistObservable } from "@legendapp/state/persist"

persistObservable(state.user, {
  pluginLocal: ObservablePersistLocalStorage,
  local: {
    name: "user",
  },
  pluginRemote: ObservablePersistFirebase,
  remote: {
    transform: {
      in: (value) => decrypt(value),
      out: (value) => encrypt(value),
    },
    onSaveError: (err) => console.error(err),
    firebase: {
      refPath: (uid) => `/users/${uid}/`,
      requireAuth: true,
    },
  },
})
```

## Roll your own plugin

Local persistence plugins are very simple - all you need is `get`, `set`, and `delete`. See [ObservablePersistLocalStorage](https://github.com/LegendApp/legend-state/blob/main/src/persist-plugins/local-storage.ts) for an example of what it looks like. Then you can just pass your provider into `configureObservable`.

Remote persistence plugins just need `get` and `set` functions. If you'd like to contribute your own please [post a GitHub issue](https://github.com/LegendApp/legend-state/issues) and we'll work with you on it.

## Contribute

The plugin system is designed to be used for all sorts of providers, so please [request additional providers](https://github.com/LegendApp/legend-state/issues) or ideally even submit a PR with an additional plugin provider. If you do build your own plugin, please let us know as we'd love to have a library of many officially supported plugins.


## index

Hi


## intro/fast

Legend-State is the result of years of iteration and dozens of experiments and rewrites to build the fastest possible state system. The primary reason it's so fast is that it optimizes for the fewest number of renders - components are only re-rendered when the state they truly care about is changed.

It may seem silly to quibble over milliseconds, but state is a hot path of most applications, so it's important that it be as fast as possible to keep your whole application snappy. In our case, some Legend users have hundreds of thousands of items flowing through state, so it became the core bottleneck and is very important to optimize.

We'll show results of the popular [krausest](https://github.com/krausest/js-framework-benchmark) benchmark and use that to describe why Legend-State is so fast. This benchmark is a good approximation of real-world performance, but the most important optimization in Legend-State is that it just does less work because it renders less, less often.

## Benchmark

<img
  src="https://legendapp.com/img/dev/state/times.png"
  style={{ borderRadius: "1rem" }}
/>

Legend-State's **optimized** mode (on the left) optimizes for rendering each row when it changes, but not the entire list, which is reflected in the fast **partial update** and **select row** benchmarks. That typically incurs an extra upfront cost to set up the listeners in each row, but Legend-State is so optimized that even so it's actually still among the fastest in the **create many rows** benchmark.

Legend-State really shines in the **replace all rows** and **swap rows** benchmarks. When the number of elements is unchaged, it does not need to re-render the list and can only render the individual rows that changed. That brings a big speed improvement for drag/drop or when items are moved around in a list.

You can opt into the fast array rendering with the `optimized` prop on the [For](../../react/fine-grained-reactivity#for) component. Note that this optimization reuses React nodes rather than replacing them as usual, so it may have unexpected behavior with some types of animations or if you are modifying the DOM externally. For that reason the benchmark considers usage of the `optimized` props as "non-keyed".

### Startup metrics

<img
  src="https://legendapp.com/img/dev/state/startup.png"
  style={{ borderRadius: "1rem" }}
/>

In these benchmarks you can see that Legend-State has the fastest TTI (time to interactive) because Legend-State doesn't do much processing up front. Creating observables and adding thousands of listeners does very little work. Because observables don't have to modify the underlying data at all, creating an observable just creates a tiny amount of metadata.

### Memory

<img
  src="https://legendapp.com/img/dev/state/memory.png"
  style={{ borderRadius: "1rem" }}
/>

The memory usage is lower than the others because Legend-State does not modify the underlying data or keep a lot of extra metadata, and it does not create many objects or closures.

## Why it's fast

Legend-State is optimized in a lot of different ways:

### Proxy to path

Legend-State uses [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), which is how it exposes the observable functions (get/set/listen etc...) on anything within an observable object. But it differs from other Proxy-based systems by not touching the underlying data all. Each proxy node represents a path within the object tree, and to get the value of any node it traverses the raw data to that path and returns the value. So every node within the state object stores minimal metadata, and never has to modify or clone the underlying data, which keeps object creation to a minimum and memory usage down.

Proxying by path also enables some really interesting list optimizations: in the For component's optimized mode, the Proxy object for the observable references an index in the array. So when array elements rearrange, the existing Proxy nodes can be updated to point to their new indices, and we can render only the changed/ moved elements and skip rendering the full array.

### Listeners at each node

Each node keeps a `Set` of listeners so that you can listen to changes to any value anywhere within the state. This is great for performance because changes only call the few listeners that are affected by that change. JavaScript's `Set` provides nice benefits here as its uniquenesss constraint ensures callbacks are added only once, and removing listeners is an [instant O(1) operation](https://bretcameron.medium.com/how-to-make-your-code-faster-using-javascript-sets-b432457a4a77).

### Granular renders

Extensive care is taken to ensure that components are rendered only when their state truly changes. Legend-State provides [functions](../../usage/reactivity) to be extra specific about when it tracks changes and [useSelector](../../react/react-introduction#2-useselector) to isolate a tracking computation to return one value. The best thing for your app's performance is to render less, less often.

### Easy fine-grained reactivity

Legend-State has [built-in helpers](../../usage/reactivity) to easily extract children so that their changes do not affect the parent. This keeps large parent components from rendering often just because their children change.

{/* TODO: Add MemoExample interactive component */}

### Shallow listeners

[Shallow listeners](../../usage/reactivity#shallow-modifier) are called on objects only when keys are added or removed, but not when children are changed. This lets the child components manage their own rendering and large parent components don't need to render.

### Array optimizations

Optimizing list rendering is a primary goal because Legend-State is built for [Legend](https://www.legendapp.com) and its huge documents and lists, so it aims to render parent list components as little as possible. When changes to an array only modify children or transpose elements, and do not add or remove elements, it can render only the changed elements and skip rendering the parent list. See [Arrays](../../usage/observable#arrays) for more details.

### Minimal closures and object creation

While other state libraries create lots of new closures and objects for each observable, Legend-State is careful to keep it to a minimum. The observable functions are created only once so there is little cost to creating tons of observables.

### No boilerplate

Because Legend-State's api is very terse and require no boilerplate code, your apps don't need to be filled with tons of extra boilerplate code. So your apps are smaller and faster because you're shipping smaller files to your users.

### Micro-optimizations

Beyond the architecture optimization, Legend-State also does a lot of micro-optimizations which don't necessarily have a huge effect on their own, but it all adds up.

- **For loop vs. forEach**: For loops are still quite a bit faster than `forEach` and don't involve creating closures, so for loops are always favored.
- **Set vs. array**: Compared to an array, `Set` has a marginal creation cost, but the uniqueness constraint and fast element removal end up making it overall faster for managing Listeners than arrays.
- **Map vs. object**: `Map` has a marginal creation cost compared to an object, but its operations are generally faster, so it is used for all the caching and comparing changing arrays.
- **Closures vs. bind**: Closures are surprisingly much faster than `bind`, so Legend-State favors creating small closures when needed.
- **isNaN is slow**: This surprised us, but `isNaN` was causing significant slowdown. `+n - +n < 1` is a much faster way to check if a string is a number. [Source](https://github.com/plotly/fast-isnumeric/blob/master/index.js)
- **Overloading Object prototype is a no-no**: We tried extending the prototype of the built-in `Object` but that caused a huge slowdown across the board, so that's no good.
- **Proxy vs. Object.defineProperty**: We also tried using `Object.defineProperty` to add properties to objects, but Proxy is much faster.
- **Cloning is slow**: Change handlers have a `getPrevious()` function to opt-in to computing the previous state because cloning objects unnecessarily was wasteful.
- **for of in Set/Map**: `for of` loops are the fastest way to iterate through Set and Map values.


## intro/getting-started

## Install Legend-State

```npm
npm install @legendapp/state
```

## Core concepts

### Observables

You can put anything in an observable: primitives, deeply nested objects, arrays, functions, etc... Observables work just like normal objects so you can interact with them without any extra complication. Just call `get()` to get a value and `set(...)` to modify it.

```js
import { observable } from "@legendapp/state";

const state$ = observable({ text: "hello", obj: { value: 10 } });

const text = state$.text.get(); // 'hello'
state$.obj.value.get() === 10; // true

// Use the set function anywhere
state$.text.set("hi");

// Easily modify the previous value
state$.text.set((text) => text + " there");
```

[Read more](../../usage/observable)

### Observing observables

You can subscribe to changes anywhere in the hierarchy of an object with `onChange(...)`, and then any change to that node will call the listener.

```js
const state$ = observable({
  settings: { theme: "light" },
  array: [{ text: "hi" }],
});

// Listen to observable directly
state$.settings.theme.onChange(({ value }) => console.log("Theme is", value));
```

The core power of Legend-State is the "observing contexts" in which any call to `get()` will subscribe the observer to that node, and the observer will re-run whenever it changes. This includes `observe`, `when`, `computed`, `useSelector`, `observer`, `<Memo>`, `<Computed>`, and reactive props (we'll get to all of that later).

```js
// This will re-run whenever accessed observables change
observe(() => {
  console.log("Theme is", state$.settings.theme.get());
});

// when waits for a value to become truthy.
await when(() => state$.settings.theme.get() === "dark");

// an observable can be computed based on other observables
const isDark$ = observable(() => state$.settings.theme.get() === "dark");
```

[Read more](../../usage/reactivity)

### Selectors

Many of the functions in Legend-State take a Selector, which can be either an observable or a function that returns a value based on observables. The selector is run in an observing context so that `get()` tracks an observable for changes. Whenever an observable changes, it re-runs the function.

Using `when` as an example of using Selectors:

```js
const isSignedIn$ = observable(false);
const isOnline$ = observable(false);

// A selector can be just an observable, which will be tracked for changes
await when(isSignedIn$);

// Or selector can be a function which tracks all get() callschanges
await when(() => isSignedIn$.get() && isOnline$.get());
```

## Getting started

### 1. Configure your options

Legend-State is designed to have a lean core that allows you and your team to add additional features, so it has configuration functions to add features as you like. If you're getting started with React we recommend using `enableReactTracking()` - it's the easiest way to use observables in React. You only need to use configuration functions once in your app's entry point.

```jsx
import { enableReactTracking } from "@legendapp/state/config/enableReactTracking";
// This makes React components automatically track get() calls to re-render
enableReactTracking({ auto: true });
```

There are also more options such as enabling getting/setting values directly with a `$` property. See [configuring](../../usage/configuring) for more details.

### 2. Create global state

Observables are designed to contain large hierarchy, and many teams like to have one large global store.

```js
import { observable } from '@legendapp/state';

export const state$ = observable({
    UI: {
        windowSize: undefined as { width: number, height: number },
        activeTab: 'home' as 'home' | 'user' | 'profile',
        ...
    },
    settings: {
        theme: 'light' as 'light' | 'dark',
        fontSize: 14,
        ...
    },
    todos: []
})
```

Or if you prefer to have multiple individual atoms in multiple files, you can do that too.

```js
// settings.ts
export const theme$ = observable('light')
export const fontSize$ = observable(14)

// UIState.ts
export const uiState$ = observable({
    windowSize: undefined as { width: number, height: number },
    activeTab: 'home' as 'home' | 'user' | 'profile',
})
```

### 3. Use in React

Head over to [React Introduction](../../react/react-introduction) for a detailed guide to getting started in React.

### 4. Persistence plugins

Use `persistObservable` to automatically persist state using any kind of local or remote storage. Legend-State includes local providers for Local Storage on web and [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) in React Native, with more local and remote providers coming soon. Use `configureObservablePersistence` to set default providers for all persisted observables, or you can set them individually if they need to be different.

The given observables will be populated with their persisted state immediately after calling `persistObservable`.

```js
// Global configuration
configureObservablePersistence({
    // Use Local Storage on web
    pluginLocal: ObservablePersistLocalStorage
    // Use react-native-mmkv in React Native
    pluginLocal: ObservablePersistMMKV
})

const state$ = observable({ store: { bigObject: { ... } } })

// Persist this observable
persistObservable(state$, {
    local: 'store' // Unique name
})
```

[Read more](../../guides/persistence)


## intro/introduction

<Callout type="warn">
Version 3 is in Beta. If you're starting a new project we suggest starting with version 3 since it's much improved over version 2.

[Switch to version 3](../../../v3)
</Callout>


Legend-State is a super fast and powerful state library for modern JavaScript apps with four primary goals:

### 1. <span className="text-lg">🦄</span> As easy as possible to use

There is no boilerplate and there are no contexts, actions, reducers, dispatchers, sagas, thunks, or epics. It doesn't modify your data at all, and you can just call `get()` to get the raw data and `set()` to change it.

React components can track access to `get()` on any observable and automatically re-render whenever it changes.

<Callout>
We use a `$` suffix on variables as a convention to indicate an observable but it's not required.
</Callout>

```jsx
// Create an observable object
const state$ = observable({ settings: { theme: "dark" } });

// Just get and set
const theme = state$.settings.theme.get();
state$.settings.theme.set("light");

// observe re-runs when accessed observables change
observe(() => {
  console.log(state$.settings.theme.get());
});

// Enable React components to automatically track observables
enableReactTracking({ auto: true });

const Component = function Component() {
  // get() makes this component re-render whenever theme changes
  const theme = state$.settings.theme.get();

  return <div>Theme: {theme}</div>;
};
```

### 2. <span className="text-lg">⚡️</span> The fastest React state library

Legend-State beats every other state library on just about every metric and is so optimized for arrays that it even beats vanilla JS on the "swap" and "replace all rows" benchmarks. At only `4kb` and with the massive reduction in boilerplate code, you'll have big savings in file size too.

<img
  src="https://legendapp.com/img/dev/state/times.png"
  style={{ borderRadius: "1rem" }}
/>

See [Fast 🔥](../fast) for more details of why Legend-State is so fast.

### 3. 🔥 Fine-grained reactivity for minimal renders

Legend-State lets you make your renders super fine-grained allowing only the leaves of your component tree to re-render when required, thus making your apps go faster 🔥, and removing unnecessary overhead from React's render cycle.


{/* TODO: Add Primitives interactive component */}

### 4. 💾 Powerful persistence

Legend-State includes a powerful [persistence plugin system](../../guides/persistence) for local caching and remote sync. It easily enables offline-first apps by tracking changes made while offline that save when coming online, managing conflict resolution, and syncing only small diffs. We use Legend-State as the sync engines in [Legend](https://legendapp.com) and [Bravely](https://bravely.io), so it is by necessity very full featured while being simple to set up.

Local persistence plugins for the browser and React Native are included, and remote sync plugins for Firebase Realtime Database, TanStack Query, and `fetch`.

```js
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import { ObservablePersistFirebase } from "@legendapp/state/persist-plugins/firebase"
import { persistObservable } from '@legendapp/state/persist'
import { observable } from '@legendapp/state'

const state$ = observable({ store: { bigObject: { ... } } })

// Persist this observable
persistObservable(state$, {
    pluginLocal: ObservablePersistLocalStorage,
    local: 'store',
    pluginRemote: ObservablePersistFirebase,
    remote: {
        firebase: {
            refPath: (uid) => `/users/${uid}/`,
            requireAuth: true,
        },
    }
})
```

[Read more](../../guides/persistence)

## Install

```npm
npm install @legendapp/state
```

## Highlights

- ✨ Super easy to use 😌
- ✨ Super fast ⚡️
- ✨ Super small at 4kb 🐥
- ✨ Fine-grained reactivity 🔥
- ✨ No boilerplate
- ✨ Designed for maximum performance and scalability
- ✨ React components re-render only on changes
- ✨ Very strongly typed with TypeScript
- ✨ Persistence plugins for automatically saving/loading from storage
- ✨ State can be global or within components

The core is platform agnostic so you can use it in vanilla JS or any framework to create and listen to observables. It includes support for React and React Native, and has plugins for automatically persisting to storage.

[Read more](../why) about why you'll love Legend-State ❤️

## Example

This example shows an overview of what using Legend-State looks like. See [Getting Started](../getting-started) to dive into how it works.

{/* TODO: Add Intro interactive component */}

## Getting Started

Continue on to [Getting Started](../getting-started) to get started!

## Community

Join us on [Discord](https://discord.gg/5CBaNtADNX) to get involved with the Legend community.

## Contributing

We welcome contributions! Please read our [Contributing Guide](https://github.com/LegendApp/legend-state) on Github


## intro/why

Legend-State is an evolution of the state system we've been using internally in [Legend](https://www.legendapp.com) since 2015 and in [Bravely](https://www.bravely.io) since 2020. It needs to be extremely fast because Legend users have documents with hundreds of thousands of items. We recently rewrote it with modern browser features, optimizing for both developer experience and best possible performance / memory usage. Comparing to other state libraries, we think you'll prefer Legend-State for these reasons:

## ⚡️ Tiny and FAST

Legend-State is the [fastest React state library](../fast), designed to be as efficient as possible. It does very little extra work and minimizes renders by only re-rendering components when their observables change. And at only `4kb` it won't hurt your bundle size.

## 😌 Feels natural

Working with observables is as simple as `get()` and `set()` - they work as you'd expect, and the observable functions are right there on the prototype.

```jsx
const state$ = observable({ value: 1 });
state$.value.get();
state$.value.set(2);

// Tracks automatically and runs on every change
observe(() => {
  console.log(state$.value.get());
});
```

## 🔥 Fine-grained reactivity

Using features like [Memo](../../react/fine-grained-reactivity#memo) it's easy to isolate renders to the smallest possible change.

{/* TODO: Add Primitives interactive component */}

For isolating a group of elements or computations, Legend-State has [built-in helpers](../../react/fine-grained-reactivity) to easily extract children so that their changes do not affect the parent. This keeps large parent components from rendering often just because their children change.

{/* TODO: Add MemoArrayExample interactive component */}

## 👷 Does not hack React internals

Some libraries hack up React internals to make signals and fine-grained reactivity work, which often doesn't work on all platforms and may break if React internals change.

Legend-State does everything above-board using hooks, with all React functionality built on top of [useSelector](../../react/react-api#useselector), which just uses `useSyncExternalStore`. Check [the source](https://github.com/LegendApp/legend-state/blob/main/src/react/useSelector.ts) to see the lack of hackery.

## 🤷‍♀️ Unopinionated

Some state libraries are for global state while some want state to reside within React. Some enourage individual atoms and others are for large global stores. Some have "actions" and "reducers" and others require immutability. But you can use Legend-State any way you want.

- **Global state or local state in React**: Up to you 🤷‍♀️
- **Individual atoms or one store**: Up to you 🤷‍♀️
- **Modify directly or in actions/reducers**: Up to you 🤷‍♀️

See [Patterns](../../guides/patterns) for more examples of different ways to use Legend-State.

## 💾 Persistence built in

> There are only two hard things in Computer Science: cache invalidation and naming things. - Phil Karlton

We don't want developers to have to worry about persisting and syncing state, because it's often very complicated and error-prone. So we've built [persistence](../../guides/persistence) plugins using Legend-State's listeners, with extensive tests to make sure it's absolutely correct.

It currently includes plugins for local persistence with Local Storage and IndexedDB on web and [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) in React Native, and remote sync plugins for Firebase Realtime Database, TanStack Query, and `fetch`.

```js
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import { ObservablePersistFirebase } from "@legendapp/state/persist-plugins/firebase"
import { persistObservable } from '@legendapp/state/persist'
import { observable } from '@legendapp/state'

const state$ = observable({ store: { bigObject: { ... } } })

// Persist this observable
persistObservable(state$, {
    pluginLocal: ObservablePersistLocalStorage,
    local: 'store',
    pluginRemote: ObservablePersistFirebase,
    remote: {
        firebase: {
            refPath: (uid) => `/users/${uid}/`,
            requireAuth: true,
        },
    }
})
```

## 🔫 It's safe from footguns

Observables prevent direct assignment, favoring more purposeful `set` and `assign` functions instead. Read more in [safety](../../usage/observable#safety).


## other/experiments

This page contains experiments for sharing and getting feedback before they're fully released.

There are not any active experiments.

## Previous experiments

1. [Computed and Memo](../../usage/reactivity)
2. [Configuring](../../usage/configuring)


## other/migrating

## 1.x to 2.0

Version 2.0 removes old deprecated features to reduce bundle size and encourage everyone to move over to the new features. Version 1.11 displays deprecation warnings to help you migrate.

So there are two migration strategies:

1. **Runtime**: Upgrade to version 1.11 and check the console for warnings whenever using deprecated features. This can give you time to do the migration slowly without breaking anything.
2. **Build time**: Upgrade to version 2.0 and use TypeScript warnings to find errors

These are all things that were changed over time between 1.0 and 2.0 so depending on when you started using Legend-State you may already be doing it the new way.

### Promise behavior changed

When setting a Promise into an observable it creates a `state` child on the observable with `isLoaded` and `error` properties that you can check for load state. After it resolves or rejects it replaces itself with the resolved value and updates the `state`. Previously in the case of an error it would replace itself with an `{ error }` object.

So if you had logic to check whether a Promise errored by checking the `error` property on the observable, you can change that to `.state.error`.

### enableLegendStateReact, enableReactDirectRender => Memo

The direct rendering enabled by `enableLegendStateReact` and `enableReactDirectRender` was fragile, hard to find in files, and the React team advised against it. So instead we are using the `Memo` component. See [Render an observable directly](../../react/fine-grained-reactivity#render-an-observableselector-directly) for more details.

To migrate you can remove usage of `enableLegendStateReact()` or `enableReactDirectRender()` as well as any usage of direct rendering, and replace it with `Memo`. When you remove those imports it will stop overriding the types so rendering observables directly will result in TypeScript errors.

If you were using `enableLegendStateReact` to render direct observables heavily, [enableReactDirectRender](../../usage/configuring#enablereactdirectrender-deprecated) is still usable to ease migration, though it will throw TypeScript errors to help you migrate away. It will be fully removed in version 3.0.

```jsx
// Remove these:
enableLegendStateReact();
enableLegendStateReact();

function Component() {
  const text$ = useObservable("test");
  return (
    <>
      Change this: {text$}
      To this: <Memo>{text$}</Memo>
    </>
  );
}
```

### Legend components changed to Reactive components

The reactive components are now better named and more easily customizable with configuration functions, exported from the normal `/react` path. See [Reactive components](../../react/fine-grained-reactivity#reactive-components) for more details.

Change:

```js
// React
import { Legend } from "@legendapp/state/react-components";
function Component() {
  return <Legend.div>...</Legend.div>;
}
// React Native
import { Legend } from "@legendapp/state/react-native-components";
function Component() {
  return <Legend.View>...</Legend.View>;
}
```

To:

```js
// React
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
enableReactComponents();

// React Native
import { enableReactNativeComponents } from "@legendapp/state/config/enableReactNativeComponents";
enableReactNativeComponents();

// Now you can use them anywhere
import { Reactive } from "@legendapp/state/react";

function Component() {
  // React
  return <Reactive.div>...</Reactive.div>;

  // React Native
  return <Reactive.View>...</Reactive.View>;
}
```

### For parameter name changed

As we've been adopting a convention of naming observables suffixed with `$`, many users were confused by the `item` prop in the render component used in For's `item` prop, so we renamed it to `item$` to make it clear that it's an observable. `item` will still work until version 3.0, but it will throw TypeScript errors to encourage changing it to `item$`.

### Reactive props changed to start with $

In an earlier version reactive props ended with $ and were changed in version 1.3.0 to allow starting with $, because it has a better UX with autocomplete and is easier to visually scan for. Both have been supported but version 2.0 will remove type support for the suffix version. It will still work in code so it doesn't break your apps, but we will fully remove it in 3.0 and suggest you at least start using the new pattern.

A recommended way to find and replace all of instances of the old method is to find `$=` in all files.

```jsx
function Component() {
  const text$ = useObservable("test");
  return (
    <Reactive.div
      // Change this
      className$={() => "..."}
      // to this
      $className={() => "..."}
    >
      ...
    </Reactive.div>
  );
}
```

### Persistence Changes

In version 2 we locked down and cleaned up the interfaces for the remote persistence APIs.

#### persistObservable returns an object with sync state

To support taking an initial state or an observable, `persistObservable` needs to return both an observable and the syncState, so it now the observable with a `state` property on it, matching the Promise behavior.

See [persistObservable](../../guides/persistence#persistobservable) for details.

```js
const { state } = persistObservable(initialStateOrObservable, { ... })
```

#### persistLocal => pluginLocal

We renamed the parameters for clarity as the difference between `local` and `persistLocal` wasn't clear. So it is now named `pluginLocal` because that makes more sense.

```js
persistObservable(initialStateOrObservable, {
    // Before
    persistLocal: ObservablePersistLocalStorage
    // After
    pluginLocal: ObservablePersistLocalStorage
 })
```

#### Remote options renamed

Since there were not any remote persistence plugins before, these changes would likely not affect you unless you made your own. See [Remote Persistence](../../guides/persistence#remote-persistence) for details.

### observer, reactive, reactiveObserver not exported from react-components

The `/react-components` export was mistakenly exporting `observer`, `reactive`, and `reactiveObserver` which are already exported from `/react`. Your editor may have automatically imported from `/react-components` so may need to be changed.

```jsx
// Change this:
import {
  observer,
  reactive,
  reactiveObserver,
} from "@legendapp/state/react-components";
// To this:
import { observer, reactive, reactiveObserver } from "@legendapp/state/react";
```

### types.d.ts moved to types/babel.d.ts

`types.d.ts` was too generic of a name now that we have a lot of configuration options, so we are naming them more specifically in a "types" folder. For now there's still only the `babel` types but this gives room to add more in the future.

```js
// Change this:
/// <reference types="@legendapp/state/types" />

// To this:
/// <reference types="@legendapp/state/types/babel" />
```

### afterBatch removed

`afterBatch` was not working 100% correctly in all cases, and the best way to fix it was to make it part of `batch(...)`.

```js
// Change
beginBatch();
afterBatch(() => {
  console.log("done");
});
obs$.set(true);
endBatch();

// To
batch(
  () => {
    obs$.set(true);
  },
  () => {
    console.log("done");
  }
);
```

## 0.23 to 1.0

### onChange changed

1. `onChange` now takes a second object parameter with `trackingType` and `initial` options. If you were using a second parameter (like `true` to track shallowly) before, use `{ trackingType: true }`.

2. The `onChange` callback now receives an object with `value`, `getPrevious`, and `changes` in it, replacing the previous multiple arguments.

These changes allow for more flexibility - it's easier for callers who care about the changes but not the current value or previous values (like persistence plugins), and the new `initial` option lets it behave more like `observe` where it runs immediately instead of waiting for a change.

```js
// Old
obs.onChange((value, getPrevious, changes) => {
  // ...
}, true);

// New
obs.onChange(
  ({ value, getPrevious, changes }) => {
    // ...
  },
  { trackingType: true }
);
```

### when and Show tweaked

They were previously checking if the value is "ready", meaning it doesn't count if it's an empty object or empty array. They now do a standard javascript truthiness check as would be expected. For the previous behavior you can use `whenReady` or `<Show ifReady={...}>`

### IndexedDB preloader removed

It was actually slower in our testing so we simplified things and just removed it. See [IndexedDB](../../guides/persistence#indexeddb) for up-to-date docs.

## 0.22 to 0.23

### Setting an observable object to the same value no longer notifies

Setting an object to itself was triggering notifications, which is not great for performance and is undesirable in most cases. It is now more targeted and will only notify on elements that actually changed. It's unlikely that will affect you, but it may be a breaking change for you if you depended on things re-computing/re-rendering even if nothing changed.

### Not automatically treating DOM nodes and React elements as opaque objects

It was adding most likely unnecessary extra code and is easily solved in a more generic way. If you're storing those in observables, wrap them in `opaqueObject(...)`.

### IndexedDB plugin support for non-dictionaries removed

For flexibility of multiple observables persisting to the same IndexedDB table, it now has an `itemID` option to save non-dictionaries. So the IndexedDB persistence plugin can be used in two ways:

1. Persisting a dictionary where each value has an `id` field, and each value will create a row in the table
2. Persisting multiple observables to their own rows in the table with the `itemID` option

```js
const settings = observable({ theme: "light" });
persistObservable(settings, {
  local: {
    name: "store",
    indexedDB: {
      itemID: "settings",
    },
  },
});
```

## 0.21 to 0.22

### Local Storage is no longer the default persistence

This was changed to reduce build size for those who don't use it. If you want to use Local Storage, configure it at the beginning of your app:

```js
import { configureObservablePersistence } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/local-storage";

configureObservablePersistence({
  persistLocal: ObservablePersistLocalStorage,
});
```

### Moved persist plugins to `/persist-plugins`

Update your import paths:

```js
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
```

### `when` is not triggered by empty {} or []

If you wanted `when` to be triggered by those, you can update it to use a selector to return a boolean like:

```js
const obs = {}
when(() => !!obs, () => {...})
```

## 0.20 to 0.21

### Changed `onChange` callback

The extra paremeters in the `onChange` callback have changed to include an array of of the changes, fixing a bug where it was only showing the latest child's change when changing multiple children while batching. This likely won't affect many of you as it's mostly intended for internal use and persistence plugins.

## Renamed React components from `legend` to `Legend`

We had originally used lower casing to match html elements, but in practice it did not autocomplete well and felt wrong. So just rename to uppercase, for example from `<legend.div />` to `<Legend.div />`.

## 0.19 to 0.20

### Removed deprecated automatic observing

The automatic observing from 0.18 was deprecated in 0.19 and is now removed. See [Deprecated automatic observing](#deprecated-automatic-observing).

### observe and useObserve

As `observe` has gotten more and more powerful, it outgrew modifying behavior based on the return value, so it now has an event parameter to control canceling listening and a cleanup function.

- If you were returning false to cancel observing, you can now use `e.cancel = true`.
- If you were returning a cleanup function you can use `e.onCleanup = () => ...`.
- It also adds a `num` param to know how many times it's run and a `previous` param to compare to the previous value.

```js
observe((e) => {
    // Cancel observing any future changes
    e.cancel = true

    // A cleanup function
    e.cleanup = () => ...
})
```

### Renamed event `dispatch` to `fire`

Just change `evt.dispatch()` to `evt.fire()` and all is good 👍.

## 0.18 to 0.19

### Deprecated automatic observing

We are deprecating the automatic observing that depended on hooking into React's internals. Components will no longer track observables automatically, but you can easily it per component in a few ways:

- Wrap components in `observer` to make them track automatically
- Wrap observable access in `useSelector` to return a value and track automatically.
- Render observables directly into JSX.

So tracking observables in React can look like this now:

```jsx
import { observable } from "@legendapp/state";
import { observer } from "@legendapp/state/react";

const Component = observer(function Component() {
  const value = observable.get();
  // This tracks because it's inside an observer
});
```

or

```jsx
import { observable } from "@legendapp/state";
import { useSelector } from "@legendapp/state/react";

const state = observable({ selected: false });

function Component() {
  // Track the value of an observable
  const value = useSelector(state);

  // Track the return value of a function
  const isSelected = useSelector(() => state.selected.get());
}
```

See [the React guide](../../react/react-introduction) for how we suggest setting up your components now.

Rendering observables directly still works though, and `enableLegendStateReact()` still enables that.

You can still enable the previous behavior for now with `enableLegendStateReact({ autoTrackingDEPRECATED: true })` while you migrate to using `observer` or `useSelector`. That option will be removed before we reach 1.0.

#### Why

- It doesn't actually work. We thought this method would be safe to use because it was inspired by Preact Signals, but as we've integrated Legend-State into more environments we found significant edge cases that seem to be unfixable and suggest that the whole concept is just unworkable.
- The React team has asked us not to do it and made it clear that it is likely to break in a future version of React.
- As Legend-State has evolved, the ideal way of using it has shifted towards fine-grained reactivity where components render minimally or only once, and we were actually specifically opting out of auto-tracking more often than not. So in the interest of pursuing the render-once ideal, we think it's actually generally better to use the [reactivity components](../../react/fine-grained-reactivity) or opt-in to tracking.
- We don't want to distract from the core mission of Legend-State with an unreliable and unstable core.

### Bindable components deprecated

We now have a more general purpose way of making reactive props that can also be used for two-way binding for inputs. So change:

```jsx
<Bindable.input bind={observable} />
```

to

```jsx
import { Legend } from "@legendapp/state/react-components";

<Legend.input value$={observable} />;
```

See [reactive props](../../react/fine-grained-reactivity) for more detauls.

### `value` is no longer exposed

Primitives no longer have a `value` that you could access and modify. We had previously removed that from the documentation and it is now removed from the code. You can just `get()` and `set()` as you would any other observable. It turned out to cause more bugs than it was worth and made the TypeScript types overly complex.

### Removed get(false)

Use `peek()` instead.

## 0.17 to 0.18

The tracing functions are renamed to use\* to be inline with hooks:

- useTraceListeners
- useTraceUpdates
- useVerifyNotTracking
- useVerifyOneRender (new)

## 0.16 to 0.17

### Primitives are now returned as observables

Observables previously tried to be clever by returning primitives directly, which was great in making it easy to work with state directly. But especially as the goal has moved more towards fine-grained reactivity, the balance shifted towards observable objects being better. So accessing primitives through state now returns observables like anything else.

#### Raw primitives:

- Pro: Easy to work with
- Con: Required `obs()` to get the observable to pass to props or render directly
- Con: Easy to track a value without realizing it

#### Observable primitives

- Pro: More consistent
- Pro: Easier to deal with undefined
- Pro: Can dot through undefined paths easily
- Pro: Doesn’t need `obs()` or set by key
- Pro: Easier to use fine-grained features without `obs()` everywhere
- Pro: Easier to pass as props without needing `obs()`
- Con: Requires `get()` for primitives

#### Changes to make:

**get()**

Wherever you were accessing primitives directly, add a `.get()` to the end of it.

**set(key, value)**

Change set by key to access the node first. It will now work fine if the node is undefined.

From: `state.profile.set('name', 'Annyong')`

To:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`state.profile.name.set('Annyong')`

**obs()**

Just remove it. The default behavior is now the same as what `obs()` did before.

### Hooks renamed

`useComputed` is now `useSelector`, re-rendering only when the return value changes.

`useComputed` now returns a `computed` observable.

## 0.15 to 0.16

### enableLegendStateReact() to observe, removed observer

Legend-State now automatically tracks observable access in any component. To set it up, just call `enableLegendStateReact()` at the beginning of your app.

Now `observer` is no longer needed, so just remove all usage of `observer`.

## 0.14 to 0.15

### Safety

There are now three levels of safety: **Unsafe**, **Default**, and **Safe**. Default is new and allows direct assignment to primitives but prevents directly assigning to everything else. The previous default behavior was Unsafe so you may see errors if you were directly assigning to objects/arrays/etc... TypeScript should show errors so it should be easy to find them. Replace those with `.set(...)` or pass in `false` as the second parameter to `observable` to go back to "Unsafe" mode.

```js
// 1. Unsafe: Use false for the previous unsafe behavior
const obs = observable({ ... }, /*safe*/ false)

// 2. Default: The new default behavior prevent directly assigning to objects, but allows directly assining to primitives
const obs = observable({ text: 'hello',  obj: {} })

obs.text = 'hi'
// ✅ Setting a primitive works in default mode but not in safe mode.

obs.obj = {}
// ❌ Error. Cannot assign to objects directly.

// 3. Safe: Safe mode prevents all direct assignment
const obs = observable({ text: 'hello',  obj: {} }, /*safe*/true)

obs.text = 'hi'
// ❌ Error. Cannot assign directly in safe mode.
```

### Renamed ref to obs

`ref` was a bit unclear and conflicted with React - the new feature to [directly render observables](../../react/fine-grained-reactivity#render-an-observable-directly) requires a `ref` property. So it is now renamed to `obs`, which feels more intuitive as it is used to get an observable.

```js
import { observable } from "@legendapp/state";

const state$ = observable({ text: "" });

// Before
const textRef = state$.ref("text");
const textRef2 = state$.text.ref();

// Now
const textObs = obs.obs("text");
const textObs2 = obs.text.obs();
```

### Array optimizations

The array optimizations are now opt-in, because they are only useful in React and can potentially have some unexpected behavior in React if modifying the DOM externally. You can enable them by using the `For` component with the `optimized` prop. See [Arrays](../../usage/observable#arrays) for more.

```jsx
import { observable } from "@legendapp/state";
import { For, observer } from "@legendapp/state/react";

const obs = observable({ items: [] });

const Row = observer(function Row({ item }) {
  return <div>{item.text}</div>;
});

const List = observer(function () {
  // The optimized prop enables the optimizations which were previously default
  return <For each={list} item={Row} optimized />;
});
```

### Shallow

Since there's now a additionally the `optimized` tracking for arrays, the shallow option on `get()` and `obs()` now has another option. So instead of passing `shallow` to an observable, use the `Tracking` namespace now.

```js
import { observable, Tracking } from "@legendapp/state";

const obs = observable([]);

// Before
obs.get(shallow);

// Now
obs.get(Tracking.shallow);
```

### Batching

The `observableBatcher` namespace is removed and the batching functions are now exported on their own.

```js
import { batch, beginBatch, endBatch, observable } from "@legendapp/state";

const obs1 = observable(0);
const obs2 = observable(0);

// begin/end
beginBatch()
obs1.set(...)
obs2.set(...)
endBatch()

// batch()
batch(() => {
    obs1.set(...)
    obs2.set(...)
}
```

### Change functions => observe/when

The new `observe` and `when` functions can automatically track all observables accessed while running them. This made the old extra change utilities unnecessary, so `onTrue`, `onHasValue`, `onEquals`, and `onChangeShallow` have been removed, saving 200 bytes (7%) from the bundle size. These are the new equivalents:

```js
import { observable, observe, when } from "@legendapp/state";

const obs = observable({ value: undefined });
const handler = () => {};

// onTrue
obs.value.onTrue(handler);
// New onTrue equivalent
when(() => obs.value === true, handler);

// onHasValue
obs.value.onHasValue("text", handler);
// onHasValue equivalent
when(() => obs.value, handler);

// onEquals
obs.value.onEquals("text", handler);
// onEquals equivalent
when(() => obs.value === "text", handler);

// onChangeShallow
obs.value.onChangeShallow(handler);
// onChangeShallow equivalent
obs.value.onChange(handler, { shallow: true });
```

### Primitive current => value

Primitive observables are now wrapped in `{ value }` instead of `{ current }`. You can also now modify the `value` directly.

```js
import { observable } from "@legendapp/state";

const obs = observable(10);
// Before
obs.current === 10;
obs.curent = 20; // ❌ Error
// Now
obs.value === 10;
obs.value = 20; // ✅ Works
```

### Renamed observableComputed and observableEvent

`observableComputed` is now just `computed` and `observableEvent` is now just `event`.

```js
import { computed, event, observableComputed, observableEvent } from "@legendapp/state";

// Before
const value = observableComputed(() => /* ... */)
// Now
const value = computed(() => /* ... */)

// Before
const evt = observableEvent(() => /* ... */)
// Now
const evt = event(() => /* ... */)
```

### Renamed LS to Bindable

The automatically bound exports are now named better and in their own exports, so change your exports from `LS` to:

```js
// Web
import { Bindable } from "@legendapp/state/react-components";

// React Native
import { Bindable } from "@legendapp/state/react-native-components";
```

### Renamed Isolate to Computed

The control flow component `Isolate` is renamed to `Computed` for naming consistency.

### Removed memo and isolate props

We found these confusing in practice as it wasn't super clear when a component was getting memoized, and it's not much extra work to use the Memo and Computed components directly. If you were using those, switch to the Computed and Memo components instead

```jsx
// Before
<div memo>...</div>
<div computed>...</div>

// Now
<Memo><div>...</div></Memo>
<Computed><div>...</div></Computed>
```


## other/other-frameworks

Legend-State is designed to be cross platform as it's mostly a vanilla observable system, but our team has expertise in React and React Native so that's where we started.

If you would like to use Legend-State for another framework, please [let us know](https://github.com/LegendApp/legend-state/issues) and we will work with you to try to build the integration in the most optimal way and include it as an officially supported plugin.


## react/fine-grained-reactivity

Legend-State enables a new way of thinking about how React components update: to **observe state changing** rather than observing renders. In this pattern, components render once and individual elements re-render themselves. This enables what we call a "render once" style - components render only the first time and state changes trigger only the tiniest possible re-renders.

You can render observable primitives directly in mini self-updating components, use reactive props to update props based on state, or use a set of control-flow components to optimize conditional rendering and arrays to re-render as little as possible.

Some teams may prefer to use Legend-State in a way that's more canonically React and skip some or all of these concepts, at least at first. But the fine-grained reactivity features can improve performance and reduce the amount of code you need to write. See [Making React fast by default and truly reactive](https://legendapp.com/open-source/legend-state/) for more details.

## Render an observable/selector directly

Use the `Memo` component to create a mini element that re-renders itself when it changes, without needing the parent component to re-render. This is the most basic and recomended way for using Legend-State with React. The children inside of `Memo` re-render themselves when the value changes, but the parent component does not re-render.

```jsx
import { observable } from "@legendapp/state";
import { Memo } from "@legendapp/state/react";

const count$ = observable(0);

// These components never re-render.
// The Memo element re-renders itself when its value changes.
function WithObservable() {
  return (
    <div>
      Count:
      <Memo>{count$}</Memo>
    </div>
  );
}
function WithSelector() {
  return (
    <div>
      <Memo>{() => <div>Count: {count$.get()}</div>}</Memo>
    </div>
  );
}
```

## Reactive components

Legend-State provides reactive versions of all platform components with reactive props. This lets you provide a Selector to props so that the component will update itself whenever the Selector changes.

For input elements it can create a two-way binding to the value, so that the observable is always in sync with the displayed value of the element.

To use these components first enable the version for your platform:

```js
// React
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
enableReactComponents();

// React Native
import { enableReactNativeComponents } from "@legendapp/state/config/enableReactNativeComponents";
enableReactNativeComponents();
```

That will populate `Reactive` with reactive versions of the built-in components. This example shows some examples using web components.

```jsx
import { useObservable } from "@legendapp/state/react";
import { Reactive } from "@legendapp/state/react"

function Component() {
    // This component renders only once
    const state$ = useObservable({ name: '', age: 18 })

    return (
        <div>
            // Reactive styling
            <Reactive.div
                $style={() => ({
                    color: state$.age.get() > 5 ? 'green' : 'red'
                })}
                $className={() => state$.age.get() > 5 ? 'kid' : 'baby'}
            />
            // Reactive children
            <Reactive.div>
                {() => (
                    <div>{state$.age.get() > 5 ? <Kid /> : <Baby />}</div>
                )}
            />
            // Two-way bind to inputs
            <Reactive.textarea $value={state$.name} />
            <Reactive.select $value={state$.age}>...</Reactive.select>
            <Reactive.input
                $value={state$.name}
                $className={() => !state$.name.get() && "border-red-500"}
                $style={() => !state$.name.get() && { borderWidth: 1 }}
            />
        </div>
    )
}
```

## Control-flow components

### Computed

Computed extracts children so that their changes do not affect the parent, but the parent's changes will still re-render them. Use this when children use observables that change often without affecting the parent, but also depends on local state in the parent.

This is equivalent to extracting it as a separate component (and passing in all needed props).

The child needs to be a function to be able to extract it into a separate tracking context, but the [Babel plugin](#optionally-add-the-babel-plugin) lets you pass it children directly.

```jsx
function Component() {
  return (
    <Computed>
      {() =>
        state$.messages.map((message) => (
          <div key={message.id}>
            {message.text} {localVar}
          </div>
        ))
      }
    </Computed>
  );
}
```

In this example see that clicking the "Render parent" button renders the parent and increments `value` and the computed children are updated too.

{/* TODO: Add Computed interactive component */}

### Memo

Memo is similar to Computed, but it will never re-render when the parent component renders - only if its own observables change. Use `Memo` when children are truly independent from the parent component. This is equivalent to extracting it as a separate component (and passing in all needed props) with `React.memo`.

The child needs to be a function to be able to extract it into a separate tracking context, but the [Babel plugin](#optionally-add-the-babel-plugin) lets you pass it children directly.

```jsx
function Component() {
  return (
    <Memo>
      {() =>
        state.messages.map((message) => (
          <div key={message.id}>
            {message.text} {localVar}
          </div>
        ))
      }
    </Memo>
  );
}
```

This is the same as the Computed example, except that the memoized children are not updated with the parent's value.

{/* TODO: Add Memo interactive component */}

### Show

Show renders child components conditionally based on the if/else props, and does not re-render the parent when the condition changes.

Passing children as a function can prevent the JSX from being created until it needs to render. That's done automatically if you use the [babel plugin](#optionally-add-the-babel-plugin).

Props:

- `if`: A computed function or an observable
- `ifReady`: A computed function or an observable. This will not render if the value is an empty object or empty array.
- `else`: Optionally provide a component to render if the condition is not met
- `children`: The components to show conditionally. This can be React elements or a function given the value returned from `if` which you can use to do more complex conditional rendering.
- `wrap`: A component to wrap the children. For example this could be [Framer Motion's AnimatePresence](https://www.framer.com/motion/) to animate the element entering/exiting.

```jsx
<Show
  if={state.show}
  else={() => <div>Nothing to see here</div>}
  wrap={AnimatePresence}
>
  {() => <Modal />}
</Show>
```

<br />

```jsx
import { Show, useObservable } from "@legendapp/state/react";
import { AnimatePresence } from "framer-motion";

function ShowExampleWithSelector() {
  const state$ = useObservable({ collection: [] });
  return (
    <Show
      if={() => state$.collection.get().length > 0}
      else={() => <div>Nothing to see here</div>}
      wrap={AnimatePresence}
    >
      {() => <Modal />}
    </Show>
  );
}
```

{/* TODO: Add Show interactive component */}

### Switch

Switch renders one child component conditionally based on the `value` prop, and does not re-render the parent when the condition changes.

Props:

- `value`: A computed function or an observable
- `children`: An object with the possible cases of `value` as keys. If `value` doesn't match any of the cases it will use the `default` case if available.

```jsx
<Switch value={state.index}>
  {{
    0: () => <div>Tab 1</div>,
    1: () => <div>Tab 2</div>,
    default: () => <div>Error</div>,
  }}
</Switch>
```

{/* TODO: Add Switch interactive component */}

### For

The `For` component is optimized for rendering arrays of observable objects so that they are extracted into a separate tracking context and don't re-render the parent.

An `optimized` prop adds additional optimizations, but in an unusual way by re-using React nodes. See [Optimized rendering](../../guides/performance#optimized-rendering) for more details.

Props:

- `each`: An observable (array, object, or Map)
- `item`: A render function which receives the item id, and item observable or undefined
- `itemProps`: Extra props to pass down to each item
- `sortValues`: If the `each` parameter is an object or Map, this is a sort function for how to sort the elements. `(A: T, B: T, AKey: string, BKey: string) => number`
- `children`: A render function or, you can pass a render function as children instead of in the `item` prop if you prefer.

```jsx
import { observable } from "@legendapp/state"
import { For, observer } from "@legendapp/state/react"

const state$ = observable({ arr: [{ id: 1, text: 'hi' }]})

const Row = observer(function Row({ item$ }) {
    const text = item$.text.get()
    return <div>{text}</div>
})
function List() {
    // 1. Use the For component with an item prop
    return <For each={state$.arr} item={Row} />

    // 2. Use the For component with a render function as the child
    return (
        <For each={list} optimized>
            {item$ => (
                <div>
                    {item$.text.get()}
                </div>
            )}
        </div>
    )
}
```

## Optionally add the Babel plugin

The Babel plugin can make the syntax for Computed, Memo, and Show less verbose. But they work fine without Babel if you don't want to or can't use it. The Babel plugin converts the JSX under the hood so you don't need to use functions as children. It converts inline elements to functions so that they can be treated reactively:

```jsx
// You write
<Computed><div>Count: {state$.count.get()}</div></Computed>
<Memo><div>Count: {state$.count.get()}</div></Memo>
<Show if={state$.visible}><Modal /></Show>

// Babel transforms it to
<Computed>{() => <div>Count: {state.count.get()}</div>}</Computed>
<Memo>{() => <div>Count: {state$.count.get()}</div>}</Memo>
<Show if={state$.visible}>{() => <Modal />}</Show>
```

To install it, add `@legendapp/state/babel` to the plugins in your `babel.config.js`:

```js
module.exports = {
  plugins: ["@legendapp/state/babel"],
};
```

If you're using typescript you can add a `.d.ts` file to your project with this in it, to expand the types to allow direct JSX children to Computed and Memo.

```js
/// <reference types="@legendapp/state/types/babel" />
```

## Create your own reactive components

### reactive

You can wrap external components in `reactive` to create reactive versions of all of their props, prefixed with `$`. This makes it so that the reactive component can accept reactive props but the target receives regular props as usual. `reactive` creates a Proxy (not an HOC) that extracts all reactive props and observes them for changes, passing the regular prop down to the component.

In this example, `reactive` adds a `$message` prop which takes a [Selector](../../intro/getting-started#selectors), while the target component receives a normal `message` prop and is only re-rendered when `message` changes.

```js
import { observable } from "@legendapp/state";
import { reactive } from "@legendapp/state/react";

const isSignedIn$ = observable(false);

const Component = reactive(function Component({ message }) {
  return <div>{message}</div>;
});

function App() {
  return (
    <Component $message={() => isSignedIn$.get() ? "Hello" : "Goodbye"} />
  );
}
```

In addition to wrapping your own functions, you can wrap external library components to make them reactive. In this example we make a [Framer Motion](https://www.framer.com/motion/) component reactive so that we can update its animations based on observables without needing to re-render the parent component or its children.

```js
import { reactive, useObservable } from "@legendapp/state/react";
import { motion } from "framer-motion";

const ReactiveMotionDiv = reactive(motion.div);

function Component() {
  // This component renders only once
  const width$ = useObservable(100);

  return (
    <ReactiveMotionDiv
      $animate={() => ({
        x: width$.get(),
      })}
    >
      ...
    </ReactiveMotionDiv>
  );
}
```

### reactiveObserver

This is a single HOC with the functionality of both `observer` and `reactive`. They both run the same function under the hood, with slightly different options, so this is the optimal way to have one HOC that does both at once.

```js
import { observable } from "@legendapp/state";
import { reactiveObserver } from "@legendapp/state/react";

const name$ = observable("Annyong");
const isSignedIn$ = observable(false);

const Component = reactiveObserver(function Component({ message }) {
  const name = name$.get();

  return (
    <div>
      {message} {name}
    </div>
  );
});

function App() {
  return (
    <Component $message={() => (isSignedIn$.get() ? "Hello" : "Goodbye")} />
  );
}
```

### reactiveComponents

`reactiveComponents` makes multiple reactive components at once. You can use this to create your own internal library of reactive components, or to wrap UI libraries that have multiple components in a namespace like `Modal.Header` and `Modal.Footer`.

```js
import { reactiveComponents, useObservable } from "@legendapp/state/react";
import { motion } from "framer-motion";

const ReactiveMotion = reactiveComponents(motion);

function Component() {
  // This component renders only once
  const width$ = useObservable(100);

  return (
    <ReactiveMotion.div
      $animate={() => ({
        x: width$.get(),
      })}
    >
      ...
    </ReactiveMotion.div>
  );
}
```


## react/helpers-and-hooks

Legend-State includes some helpful observables and hooks for common tasks. These are available at their own import paths so they don't increase the size of your bundle unless you use them.

## Helper observables

### currentDate

`currentDate` is an observable containing the current date (with no time) that changes automatically at midnight.

```js
import { currentDate } from "@legendapp/state/helpers/time"

observe(() => {
    console.log('Today is': currentDate.get())
})
```

### currentTime

`currentTime` is an observable containing the current time that changes automatically every minute.

```js
import { currentTime } from "@legendapp/state/helpers/time"

observe(() => {
    console.log('The time is is': currentTime.get())
})
```

### pageHash (web)

`pageHash` is an observable that updates with the page hash, and changes the page hash when the observable is changed. Use `configurePageHash` to control how it sets the page hash, with `pushState | replaceState | location.hash`

```jsx
import { pageHash, configurePageHash } from '@legendapp/state/helpers/pageHash'

configurePageHash({ setter: 'pushState' })

observe(() => {
    console.log('hash changed to': pageHash.get())
})

pageHash.set('value=test')
// location.hash == "#value=test"
```

### pageHashParams (web)

`pageHashParams` is an observable that updates with the page hash, and changes the page hash when the observable is changed. Use `configurePageHashParams` to control how it sets the page hash, with `pushState | replaceState | location.hash`

```jsx
import { pageHashParams, configurePageHash } from '@legendapp/state/helpers/pageHashParams'

observe(() => {
    console.log('userid param changed to': pageHashParams.userid.get())
})

pageHashParams.userid.set('newuser')
// location.hash == "#userid=newuser"
```

## Hooks

### useHover (web)

`useHover` returns an observable whose value is `true | false` based on whether the target element is hovered. This can be useful for using fine-grained reactivity features to update without re-rendering the component, or to pass the observable around to other components for them to consume it.

```jsx
import { Show } from "@legendapp/state/react";
import { useHover } from "@legendapp/state/react-hooks/useHover";
import { useRef } from "react";

function ButtonWithTooltip() {
  const refButton = useRef();
  const isHovered = useHover(refButton);

  return (
    <div>
      <button ref={refButton}>Click me</button>
      <Show if={isHovered}>
        {() => <Tooltip text="Tooltip!" target={refButton} />}
      </Show>
    </div>
  );
}
```

### useIsMounted

`useIsMounted` returns an observable whose value is `true | false` based on whether the component is mounted. This can be useful in delayed or asynchronous functions to make sure it's running an a component that's still mounted.

```jsx
import { useIsMounted } from "@legendapp/state/react/useIsMounted";

function Component() {
  const isMounted = useIsMounted();

  const onClick = () => {
    setTimeout(() => {
      if (isMounted.get()) {
        console.log("Debounced click");
      }
    }, 100);
  };

  return <button onClick={onClick}>Click me</button>;
}
```

### useMeasure (web)

`useMeasure` returns an observable whose value is the size (`{ width: number, height: number }`) of the target element. It starts with undefined values that get set after initial mount, and whenever the element resizes.

```jsx
import { useMeasure } from "@legendapp/state/react-hooks/useMeasure";
import { useRef } from "react";

function Component() {
  const ref = useRef();
  const { width, height } = useMeasure(ref);

  return (
    <div ref={ref}>
      Width: {width}, Height: {height}
    </div>
  );
}
```

One example of where this could be useful is to drive animations. This example measures the size of an inner element to animate a bottom sheet from the bottom to its height. It uses [framer-motion](https://www.framer.com/motion) and [reactive](../fine-grained-reactivity#reactive) to be able to drive animations with observable values.

```jsx
import { reactive } from "@legendapp/state/react";
import { useMeasure } from "@legendapp/state/react-hooks/useMeasure";
import { motion } from "framer-motion";
import { useRef } from "react";

const MotionDiv$ = reactive(motion.div);

function BottomSheet({ children }) {
  const refInner = useRef();
  const { width, height } = useMeasure(refInner);

  return (
    <MotionDiv$
      style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      $animate={() => ({ y: -height.get() })}
    >
      <div ref={refInner}>{children}</div>
    </MotionDiv$>
  );
}
```

### createObservableHook

`createObservableHook` is a helper to convert an existing hook to return an observable. It works by overriding `useState` and `useReducer` in the hopes of catching and converting them into observable sets. So it may work for some hooks and it may not. Please let us know on [GitHub](https://github.com/LegendApp/legend-state/issues) if it's not working for some hooks.

```js
import { createObservableHook } from "@legendapp/state/react-hooks/createObservableHook"

const useMyHookObservable = createObservableHook(useMyHook)

function Component() {
    const value = useMyHookObservable()
    ...
}
```


## react/react-api

## Reading state

### observer

`observer` is the suggested way of consuming observables for the best performance and safety.

It makes the whole component into an observing context - it automatically tracks observables for changes when `get()` is called, even from within hooks or helper functions.

<Callout title="The best option">
Although observer looks like an HOC, it actually creates a Proxy around the component, with effectively no performance cost. So it is much more efficient than using multiple hooks, and much more efficient and safer than [enableReactTracking](../../usage/configuring#enablereacttracking).

`enableReactTracking` and `observer` can be used together - observer will optimize away the auto tracking behavior in favor of its more efficient tracking.
</Callout>

See [Tracking](../../usage/reactivity#observing-contexts) for more about when it tracks.

```jsx
import { observable } from "@legendapp/state"
import { observer } from "@legendapp/state/react"

const state$ = observable({ count: 0 })

const Component = observer(function Component() {
  // Accessing state automatically makes this component track changes to re-render
  const count = state$.count.get()

  // Re-renders whenever count changes
  return <div>{count}</div>
});
```

### useSelector

`useSelector` computes a value and automatically listens to any observables accessed while running, and only re-renders if the computed value changes.

Props:

- `selector`: Observable or computation function that listens to observables accessed while running
- `options`: `{ suspense: boolean }`: Enable suspense when the value is a Promise and you're using it within React.Suspense.

```jsx
import { observable } from "@legendapp/state"
import { useSelector } from "@legendapp/state/react"

const state$ = observable({ selected: 1, theme })

const Component = ({ id }) => {
    // Only re-renders if the return value changes
    const isSelected = useSelector(() => id === state$.selected.get())

    // Get the raw value of an observable and listen to it
    const theme = useSelector(state$.theme)

    ...
}
```

#### Using with React Suspense

Using `{ suspense: true }` as the second parameter makes the component work with Suspense. If the observable is a Promise, Suspense will render the fallback until it resolves to a value.

```jsx
import { useObservable, useSelector } from "@legendapp/state/react";
import { Suspense } from "react";

function Test({ state$ }) {
  const value = useSelector(state$, { suspense: true });
  return <div>{value}</div>;
}

export default function App() {
  const state$ = useObservable(
    new Promise((resolve) => {
      setTimeout(() => {
        resolve("hello");
      }, 1000);
    })
  );
  return (
    <div>
      <div>Suspense test</div>
      <Suspense fallback={<div>Loading...</div>}>
        <Test state$={state$} />
      </Suspense>
    </div>
  );
}
```

### useObserve

`useObserve` creates an [observe](../../usage/reactivity#observe) which you can use to take actions when observables change. This can be effectively similar to `useEffect` for observables, except that it runs when observables change and not because of a deps array changing.

Like `observe`, `useObserve` has an optional second callback parameter which will run after the selector, and does not track changes. This can be useful for observing an `event` or a single `observable`.

Note that `useObserve` runs during component render, not after render like `useEffect`. If you want an observer that runs after render, see [useObserveEffect](#useobserveeffect).

```jsx
import { event } from "@legendapp/state";
import { useObserve, useObservable, Reactive } from "@legendapp/state/react";

const eventUpdateTitle = event();

function ProfilePage() {
  const profile$ = useObservable({ name: "" });

  // This runs whenever profile changes
  useObserve(() => {
    document.title = `${profile$.name.get()} - Profile`;
  });

  // Observe a single observable with a callback when it changes
  useObserve(profile$.name, ({ value }) => {
    document.title = `${value} - Profile`;
  });

  // Observe an event with a callback when it changes
  useObserve(eventUpdateTitle, () => {
    document.title = `${profile$.name.get()} - Profile`;
  });

  return (
    <div>
      <span>Name:</span>
      <Reactive.input $value={profile$.name} />
    </div>
  );
}
```

### useObserveEffect

`useObserveEffect` is the same as [useObserve](#useobserve) except that it doesn't run until the component is mounted.

## Hooks for creating local state

### useObservable

The `useObservable` hook can be used to create an observable within a React component. This can be useful when state is specific to the lifetime of the component, or to hold multiple values in local state.

Its observables will not be automatically tracked for re-rendering, so you can track them [the same as any other observable](../react-introduction#use-observable-state).

As with

```jsx
import { observer, useObservable } from "@legendapp/state/react"

const Component = function Component() {
    const state$ = useObservable({
        title: 'Title',
        first: '',
        last: '',
        profile: {...}
    })

    const fullname$ = useObservable(() => `${state$.fname.get()} ${state$.lname.get()}`)

    return (
        <div>
            <div>{fullname$}</div>
            <Input text={state$.first} />
            <Input text={state$.last} />
            <Profile name={fullname$} />
        </div>
    )
}
```

### useComputed

`useComputed` is like `useObservable` and creates a [computed](../../usage/reactivity#computed) observable.

```jsx
import { observable } from "@legendapp/state";
import { useComputed, Memo } from "@legendapp/state/react";

const state$ = observable({ test: 10, test2: 20 });

function Component() {
  const sum = useComputed(() => state$.test.get() + state$.test2.get());

  return <div>Sum: <Memo>{sum}</Memo></div>;
}
```

### useObservableReducer

`useObservableReducer` works the same way as `useReducer` but sets an observable rather than triggering a render.

```jsx
import { useObservableReducer } from "@legendapp/state/react"

const Component = () => {
    // Only re-renders if the return value changes
    const isSelected$ = useObservableReducer()

    // Get the value of the reducer
    const theme = isSelected$.get()

    ...
}
```

### Using with Context

You may prefer passing local state through Context rather than (or in addition to) having a global state. To do that you can simply add the observable to your Context as usual, and consume the Context from child component. The observable itself is a stable object so changing the value of an observable will not cause a re-render.

```jsx
import { createContext, useContext } from "react";
import { Memo, observer, useObservable } from "@legendapp/state/react";

const StateContext = createContext();

function App() {
  const state$ = useObservable({
    profile: {
      name: "",
    },
  });

  return (
    <StateContext.Provider value={state$}>
      <div>
        <Sidebar />
        <Main />
      </div>
    </StateContext.Provider>
  );
}

const Sidebar = function Sidebar() {
  // StateContext will never change so this will never cause a render
  const state$ = useContext(StateContext);

  // This component never re-renders, but name re-renders itself
  return (
    <div>
      Name: <Memo>{state$.profile.name}</Memo>
    </div>
  );
};
```

## Miscellaneous hooks

### useMount

Using observable hooks we generally avoid the built-in hooks and dependency arrays, so we have a `useMount` hook for convenience, which is just `useEffect` under the hood.

```jsx
import { useMount } from "@legendapp/state/react";

const Component = () => {
  useMount(() => console.log("mounted"));
};
```

### useUnmount

Like the `useMount` hook, `useUnmount` is just `useEffect` under the hood.

```jsx
import { useUnmount } from "@legendapp/state/react";

const Component = () => {
  useUnmount(() => console.log("un-mounted"));
};
```

### useEffectOnce

This is `useEffect` with a workaround in development mode to make sure it only runs once.

```jsx
import { useEffectOnce } from "@legendapp/state/react";

const Component = () => {
  useEffectOnce(() => {
    console.log("mounted");
  }, []);
};
```

### useMountOnce

This is `useMount` with a workaround in development mode to make sure it only runs once.

```jsx
import { useMountOnce } from "@legendapp/state/react";

const Component = () => {
  useMountOnce(() => console.log("mounted"));
};
```

### useUnmountOnce

This is `useEffect` with a workaround in development mode to make sure it only runs once.

```jsx
import { useUnmountOnce } from "@legendapp/state/react";

const Component = () => {
  useUnmountOnce(() => console.log("mounted"));
};
```

### usePauseProvider

<Callout>
Version >= 2.1.1
</Callout>

This creates a React Context Provider with a `paused$` observable. Set `paused$` to `true` to pause all rendering from observable changes under the context, and set it `false` to resume. This applies to everything within Legend-State like observer, useSelector, Reactive, Memo, etc... But normal renders coming from React or other state is not affected.

{/* TODO: Add PauseExample interactive component */}


## react/react-introduction

This is a high level overview for how to work with Legend-State in React. See [React API](../react-api) for more specific details. Legend-State supports both React and React Native, but most of the examples are in React for ease of showing live demos.

## Component reactivity

The first step to working with observables in React is to make your components re-render when observable values change. Legend-State has three ways for your components to update themselves based on observables. This applies to all observables, whether in global state or local within a component.

### enableReactTracking

To get started we recommend [enableReactTracking](../../usage/configuring#enablereacttracking) - it's the easiest way to work with observables in React. You only need to enable this once in your app's entry point.

```jsx
import { observable } from "@legendapp/state";
import { enableReactTracking } from "@legendapp/state/config/enableReactTracking";

enableReactTracking({
    auto: true,
});

const name$ = observable("Annyong");

function Component() {
  // The component re-renders when name changes
  const name = name$.get();

  return <div>{name}</div>;
}
```

We recommend using this to get started and for rapid prototyping, but it's always better to use `observer`. Under the hood, when called from a React component, it replaces `get()` with a `useSelector` hook. So keep in mind that it acts like a hook, so it is subject to the rules of hooks. So it can cause errors when used conditionally or within loops.

### observer

[observer](../react-api#observer) turns the component into an [observing context](../../usage/reactivity#observing-contexts) so that `.get()` will trigger re-render when observable change. This is the best and most efficient way to use observables in React. Just wrap your components in `observer` to make them efficiently track all accessed observables.

<Callout title="Not an HOC">
Although observer looks like an HOC, it actually creates a Proxy around the component, with effectively no performance cost, so it is extremely efficient.
</Callout>

```jsx
import { observable } from "@legendapp/state";
import { observer } from "@legendapp/state/react";

const state$ = observable({ count: 0 });

const Component = observer(function Component() {
  // Accessing state$ automatically makes this component track changes to re-render
  const count = state$.count.get();

  // Re-renders whenever count changes
  return <div>{count}</div>;
});
```

### useSelector

`useSelector` returns the value of an observable or a function and updates the component when its value changes. You can use it for more complex cases to compute a value based on observables, and only re-render when its return value changes. See [useSelector](../react-api#useselector) for more in-depth details.

```jsx
import { observable } from "@legendapp/state";
import { useSelector } from "@legendapp/state/react";

const state$ = observable({ fname: "hello", lname: "there" });

function Component() {
  // Re-render when fname changes
  const fname = useSelector(state$.fname);
  // Re-render when the computed value of fullname changes
  const fullname = useSelector(
    () => `${state$.fname.get()} ${state$.lname.get()}`
  );

  return (
    <div>
      {fname} {fullname}
    </div>
  );
}
```

## Local state

In addition to using global state, you can create local state with `useObservable` to use immediately or pass down through children or context.

```jsx
import { observer, useObservable } from "@legendapp/state/react";

function App() {
  const store$ = useObservable({
    profile: { name: "hi" },
  });

  // This component does not get() the store so only Profile will re-render on changes

  return (
    <div>
      <Profile profile$={store$.profile} />
    </div>
  );
}

const Profile = observer(function Profile({ profile$ }) {
  const name = profile$.name.get();

  return <div>Name: {name}</div>;
})
```

## Fine-grained reactivity

A new (and fun) pattern with Legend-State is to make re-renders fine-grained so that your full components don't re-render at all - focusing updates to our tiny fine-grained components.

The most basic way to optimize renders is to have observable text or numbers render themselves, so their parent component doesn't have to.

{/* TODO: Add EasyExample interactive component */}

You can take it even further with the `Reactive` components and control-flow components like `For`, `Show`, and `Switch`. Combining these we can use what we call a "render once" style - components render only the first time and state changes trigger only the tiniest possible re-renders. Especially with very large components, rendering the full component less often can give you a huge performance boost.

```jsx
import { observable } from "@legendapp/state";
import { Memo, For, Reactive, Show, Switch } from "@legendapp/state/react";

const state$ = observable({ showModal: false, page: 0, users: [] });

function MemoExample() {
  // This component itself never re-renders

  return (
    <div>
      // Reactive components have reactive props and children which re-render
      themselves on changes
      <Reactive.div
        $className={state$.showModal.get() ? "bg-blue-500" : "bg-red-500"}
      >
        {() => `Showing page: ${state$.page.get()}`}
      </Reactive.div>
      // Show re-renders itself whenever showModal changes
      <Show if={state$.showModal}>{() => <Modal />}</Show>
      // Switch re-renders itself whenever page changes
      <Switch value={state$.page}>
        {{
          0: <Page0 />,
          1: <Page1 />,
          2: <Page2 />,
        }}
      </Switch>
      // For optimizes array updates to be much faster
      <For each={state$.users} item={User} optimized />
    </div>
  );
}

function User({ item }) {
  return <Memo>{item.name}</Memo>;
}
```

These fine-grained reactivity patterns are inspired by Knockout.js as well as more modern frameworks like Solid and Svelte. They are a great way to optimize your apps, but teams who want a more canonical React experience or easy migration may want to ignore or use them sparingly to optimize specific heavy components.

[Read more](../fine-grained-reactivity)

## Example

This example shows:

1. State persisted to local storage
2. Reactive components

{/* TODO: Add Persistence interactive component */}


## react/tracing

If you notice your components feeling too slow or seeming to render too often, two helpful functions can show you exactly what observables they're listening to and why they're rendering.

## useTraceListeners()

Call `useTraceListeners()` anywhere within `observer` or any React component to console.log a list of every observable being track for changes. This can help you find and reduce the number of listeners.

```jsx
import { observable } from "@legendapp/state";
import { observer, useValue } from "@legendapp/state/react";
import { useTraceListeners } from "@legendapp/state/trace";

const state$ = observable({ count: 0 });

const Component = observer(function Component(props) {
  // Call useTraceListeners anywhere inside the component
  useTraceListeners();

  const count = useValue(state$.count);

  return <div>{count}</div>;

  /* This logs:

    [legend-state] tracking 1 observable:
    1: count

    */
});
```

## useTraceUpdates()

Call `useTraceUpdates()` anywhere within `observer` or any React component to console.log information about the observable change that causes each render. This can help you track down why components are rendering too often.

```jsx
import { observable } from "@legendapp/state";
import { observer, useValue } from "@legendapp/state/react";
import { useTraceUpdates } from "@legendapp/state/trace";

const state$ = observable({ count: 0 });

const Component = observer(function Component(props) {
  // Call useTraceUpdates anywhere inside the component
  useTraceUpdates();

  const count = useValue(state$.count);

  return <div>{count}</div>;

  /* This logs:

    [legend-state] Rendering because "count" changed:
    from: 0
    to: 1

    */
});
```

## useVerifyNotTracking()

Call `useVerifyNotTracking()` anywhere within any React component to console.error if it is tracking anything. This is useful if you are going for fine-grained reactivity and want to make sure parent components are not tracking any observables.

```jsx
import { observable } from "@legendapp/state";
import { Memo, observer, useValue } from "@legendapp/state/react";
import { useVerifyNotTracking } from "@legendapp/state/trace";

const state$ = observable({ count: 0 });

const Component = observer(function Component(props) {
  // Call useVerifyNotTracking anywhere inside the component
  useVerifyNotTracking();

  const count = useValue(state$.count);

  // This will log an error because get() makes it track
  return <div>{count}</div>;
});
const FineComponent = observer(function FineComponent(props) {
  // Call useVerifyNotTracking anywhere inside the component
  useVerifyNotTracking();

  // This will not log because rendering the observable directly
  // does not re-render this component
  return <Memo>{state$.count}</Memo>;
});
```

## useVerifyOneRender()

Call `useVerifyOneRender()` anywhere within any React component to console.error if it renders more than once. This is useful if you and want to make sure components are not rendered more than once.

```jsx
import { observable } from "@legendapp/state";
import { observer, useValue } from "@legendapp/state/react";
import { useVerifyOneRender } from "@legendapp/state/trace";

const state$ = observable({ count: 0 });

const Component = observer(function Component(props) {
  // Call useVerifyOneRender anywhere inside the component
  useVerifyOneRender();

  const count = useValue(state$.count);

  // This will log an error after one render when count is updated
  return <div>{count}</div>;
});
const Component = observer(function Component(props) {
  // Call useVerifyOneRender anywhere inside the component
  useVerifyOneRender();

  // This will not log because `get(false)` does not track observable
  // does not re-render this component
  return <div>{state$.count.peek()}</div>;
});
```

<Callout>
Note: All of these hooks take name as an argument which can be used to identify which component is logging it
</Callout>

## What to do with this information

- You may want to call `get()` at a higher level in an object to only listen to it, and not every single child.
- Use a shallow listener with `get(true)` to only update when keys are added to or removed from the object.
- You may want to call `peek()` to not listen at all.

If you find an observable changing often and you're not sure why, you can put a breakpoint on the console log to catch it. Or add your own listener to the observable to watch every change:

```js
// Why is count rendering so often?
state.count.onChange(({ value }) => {
  console.log("Count changed", value);
  console.trace();
  debugger;
});
```


## usage/configuring

Legend-State is designed to have a lean core that allows you and your team to add additional features, so it has configuration functions to add features as you like.

These functions add features and augment the TypeScript interface to add the new functions, so just importing the file adds the interface.

These configuration functions only need to be called once, before their effects are used, and then they will work anywhere. It should generally be at the top of the file that's the entry point of your app or is imported everywhere, or it could be at the top of a global state file.

### enableReactTracking

This makes React components auto-track observables, so all you need to do is `get()` an observable and the component will re-render when it changes.

```js
import { enableReactTracking } from "@legendapp/state/config/enableReactTracking"
enableReactTracking({
    auto: true,
})
```

Now you can just `get()` and components will be automatically reactive.

```jsx
import { observable } from "@legendapp/state"
const state$ = observable({ test: "hi" })

function Component() {
  // This makes this component responsive to test changing
  const test = state$.test.get()

  return <div>{test}</div>
}
```

<Callout type="warn" title="Caution: Rules of hooks">
Under the hood this replaces the `get()` with a `useSelector` hook so it is subject to the rules of hooks. That means it can cause problems if you use `get()` conditionally or within a dynamic loop.

We recommend that you use this while getting started and for rapid prototyping. Then wrap your components with [observer](../../react/react-api#observer) for improved performance and safety.
</Callout>

### enableReactComponents, enableReactNativeComponents

Legend-State provides reactive versions of all platform components with reactive props. To use these components first enable the version for your platform:

```js
// React
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents"
enableReactComponents()

// React Native
import { enableReactNativeComponents } from "@legendapp/state/config/enableReactNativeComponents"
enableReactNativeComponents()
```

Now you can use `Reactive`.

```jsx
import { Reactive } from "@legendapp/state/react"

function Component() {
  return (
    <Reactive.div
      $style={() => ({
        color: state.age.get() > 5 ? "green" : "red",
      })}
      $className={() => (state.age.get() > 5 ? "kid" : "baby")}
    />
  )
}
```

See [Reactive components](../../react/fine-grained-reactivity#reactive-components) for more details.

### enableDirectAccess

This enables accessing and setting the raw value of an observable directly. It's a shorthand for `get()` and `set(...)`.

```js
import { enableDirectAccess } from "@legendapp/state/config/enableDirectAccess"
enableDirectAccess()
```

Now you can access/modify observables directly.

```js
import { observable } from "@legendapp/state"

const state$ = observable({ test: "hi", num: 0 })

// $ is a shorthand for get()
const testValue = state$.test.$

// Assign to $ as a shorthand for set()
state$.test.$ = "hello"

// Assign objects too just like you can with set()
state$.$ = { test: "hello" }

// Incrementing works as you'd expect
state$.num.$++
```

### enableDirectPeek

This enables accessing and setting the raw value of an observable directly without tracking or notifying listeners. Getting with `._` is a shorthand for `peek()` and assigning to `._` modifies the underlying data without notifying. Modifying data without notifying is likely necessary in only very specific scenarios so use it with care.

```js
import { enableDirectPeek } from "@legendapp/state/config/enableDirectPeek"
enableDirectPeek()
```

Now you can access/modify observables directly without notifying.

```js
import { observable } from "@legendapp/state"

const state$ = observable({ test: "hi", num: 0 })

// _ is a shorthand for peek()
const testValue = state$.test._

// Assign to _ to modify the underlying object without notifying listeners
state$.test._ = "hello"

// Assign objects too
state$._ = { test: "hello" }
```

### enableReactUse (deprecated)

<Callout type="warn">
This was recommended before the introduction enableReactTracking. It is now deprecated and will be removed in version 3.0.
</Callout>

This adds a `use()` function to all observables, which gets the value and makes the component reactive to the observable changing. It simply runs `useSelector(obs)` under the hood.

```js
import { enableReactUse } from "@legendapp/state/config/enableReactUse"
enableReactUse()
```

Now you can use `use()`.

```jsx
import { observable } from "@legendapp/state"
const state$ = observable({ test: "hi" })

function Component() {
  // This makes this component responsive to test changing
  const test = state$.test.use()

  return <div>{test}</div>
}
```

### enableReactDirectRender (deprecated)
### enableLegendStateReact (deprecated)

<Callout type="warn">
Note that these are deprecated in favor of using [Memo](../../react/fine-grained-reactivity#render-an-observableselector-directly). Although it was cool and terse, it was unclear at a glance that the element was reactive. Memo is exactly the same behavior, but more descriptive.
</Callout>

This enables rendering observables directly into React, creates an element that's reactive to the observable changing.

```jsx
import { observable } from '@legendapp/state';
import { enableReactDirectRender } from '@legendapp/state/config/enableReactDirectRender';
enableReactDirectRender()

const state$ = observable({ test: 'hi' })

function Component() {
    // The observable can now be rendered directly to create a self-reactive elemtn
    return <div>{state$.test}</div>
}
```


<Callout type="warn">
Note that these are deprecated in favor of using [Memo](../../react/fine-grained-reactivity#render-an-observableselector-directly). Although it was cool and terse, it was unclear at a glance that the element was reactive. Memo is exactly the same behavior, but more descriptive.
</Callout>

This enables rendering observables directly into React, creates an element that's reactive to the observable changing.

```jsx
import { observable } from '@legendapp/state';
import { enableReactDirectRender } from '@legendapp/state/config/enableReactDirectRender';
enableReactDirectRender()

const state$ = observable({ test: 'hi' })

function Component() {
    // The observable can now be rendered directly to create a self-reactive elemtn
    return <div>{state$.test}</div>
}
```


## usage/helper-functions

## opaqueObject

`opaqueObject` marks an object in an observable as opaque so that it will be treated as a primitive, so that properties inside the opaque object will not be observable.

This is useful for storing DOM or React elements or other large objects in an observable when you don't care about tracking its properties changing.

```js
import { observable. opaqueObject } from '@legendapp/state'

const state$ = observable({ text: 'hi', body: opaqueObject(document.body) })
```

## mergeIntoObservable

If you want to merge a deep object into an observable, `mergeIntoObservable` can do that and retain all of the existing observables and listeners on the way, and fire listeners as values change. This is used by `persistObservable` under the hood.

```js
import { observable } from "@legendapp/state";
import { mergeIntoObservable } from "@legendapp/state";

const state$ = observable({ store: { text: "hello", other: "hello there" } });

state$.store.text.onChange(({ value }) =>
  console.log(`text changed to "${value}"`)
);

const newValue = { store: { text: "hi", other: "hi there" } };
mergeIntoObservable(state$, newValue);

// text changed to "hi"

state$.store === newValue.store; // ✅ true
```

## lockObservable

To ensure that observables are only modified within certain actions, you can lock observables so that they cannot be modified, then unlock them temporarily in your actions. This is used under the hood by `computed`.

```js
import { lockObservable, observable } from '@legendapp/state'

const state$ = observable({ store: { ... } })
lockObservable(state$, true)

function safeAction() {
    // Unlock it to modify it
    lockObservable(state$, false)
    // Modify it
    state$.set({ store: { ... } })
    // Lock it back
    lockObservable(state$, true)
}
```

## trackHistory

`trackHistory` creates an observable that tracks all changes in the target observable, with the previous value at the time it was changed.

Since the history is an observable you can observe it or persist it like any other observable. This can be useful for saving a version history for a text editor or creating an undo stack.

An optional second parameter lets you use an existing observable for storing the history, which can be useful to save history into an existing state object.

```js
import { observable } from '@legendapp/state'
import { trackHistory } from '@legendapp/state/history'

const state$ = observable({ profile: { name: 'Hello' }})

// Track all changes to state
const history = trackHistory(state$)

// Change something in state
state$.profile.name.set('Annyong')

// History shows the previous value when it changed:
{
    1666593133018: {
        profile: {
            name: 'Hello'
        }
    }
}
```


## usage/observable

You can put anything in an observable: primitives, deeply nested objects, arrays, functions, etc... Observables work just like normal objects so you can interact with them without any extra complication. Just call `get()` to get a value and `set(...)` to modify it.

```js
import { observable } from "@legendapp/state";

const state$ = observable({ text: "hello" });

console.log(state$.get());
// { text: 'hello' }
```

An observable's constructor can include functions or [computed](#computed)/[proxy](#proxy) observables.

```js
import { computed, observable } from "@legendapp/state";

const state$ = observable({
  fname: "hello",
  lname: "there",
  setName: (name: string) => {
    // Create Actions by just adding a function
    const [fname, lname] = name.split(name);
    state$.assign({
      fname,
      lname,
    });
  },
  fullname: computed((): Observable<string> => {
    // Set up computed observables within your state object
    // or if you prefer them elsewhere that's cool too 🤟
    return `${state$.fname.get()} ${state$.lname.get()}`;
  }),
});

console.log(state$.fullname.get());
// hello there
```

> Note: In TypeScript, you need to type the return value of nested `computed` functions or the observable will have a type of `any`.

## Observable functions

### get()

Observables use [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to expose observable functions and track changes, so an observable is a Proxy pointing to the actual data. You can use `get()` to get the actual value of any observable.

```js
const profile = { name: "Test user" };
const state$ = observable({ profile: profile, test: 0 });

// The raw value is unchanged
state$.profile.get(); // { name: 'Test user' }
state$.profile === profile; // ❌ false. The observable is not strictly equal to profile.
state$.profile.get() === profile; // ✅ true. The raw data is exactly what was set.
```

Accessing properties through the observable will create a Proxy for every property accessed, but it will not do that while accessing the raw data. So you may want to retrieve the raw data before doing expensive computations that do not need to notify.

```js
const state$ = observable({ data: someHugeThing });
const { data } = state$.get();

// Nothing special happens when working with the raw data
processData(data);
```

Calling `get()` within a tracking context tracks the observable automatically. You can change that behavior with a parameter `true` to track only when keys are added/removed. See [observing contexts](../reactivity#observing-contexts) for more details.

```js
state$.get(true); // Create a shallow listener
```

### peek()

`peek()` returns the raw value in the same way as `get()`, but it does not automatically track it. Use this when you don't want the component/observing context to update when the value changes.

### set()

You can use `set()` to modify the observable, at any path within it. You can even `set()` on a node that is currently undefined, and it will fill in the object tree to make it work.

```js
const state$ = observable({ text: "hi" });

// Set directly
state$.text.set("hello there");

// Set with a function relative to previous value
state$.text.set((prev) => prev + " there");

// Set will automatically fill out objects that were undefined
state$.otherKey.otherProp.set("hi");
```

### assign()

Assign is a shallow operation matching `Object.assign`. If you want a deep merge, see [mergeIntoObservable](../helper-functions#mergeintoobservable).

```js
const state$ = observable({ text: "hi" });

// Assign
state$.assign({ text: "hi2" });
```

### delete()

Observables provide a `delete` function to delete a key from an object.

```js
const state$ = observable({ text: "hi" });

// Delete text
state$.text.delete();

// Set the whole value to undefined
state$.delete();
```

## Observable Types

### Computed

`computed` takes a function that accesses other observables, and automatically tracks the observables accessed while computing. So you can return a computed value based on one or multiple observables, and it will update whenever one of them changes.

The compute function is lazy so it won't run until you `get()` the value the first time.

```js
const state$ = observable({ test: 10, test2: 20 });

// Returning a function makes it computed from other observables
const computed$ = computed(() => state$.test.get() + state$.test2.get());
// computed$.get() === 30

state$.test.set(5);
// computed$.get() === 25
```

### Two-way computed

`computed` has an optional `set` parameter to run when setting the value. This lets you pass state changes onto the target observables, so the computed observable is bound to the targets in both directions. Without a `set` parameter, a one-way computed is read-only.

```js
const selected$ = observable([false, false, false]);
const selectedAll$ = computed(
  // selectedAll is true when every element is selected
  () => selected$.every((val$) => val$.get()),

  // setting selectedAll sets the value of every element
  (value) => selected$.forEach((val$) => val$.set(value))
);

selectedAll$.set(true);
// selected.get() === [true, true, true]
```

### Linked observables

If you return an observable in `computed`, it will create a two-way link to the target observable. Any observable operations and listeners on the link will work the same as interacting with the original target.

```js
const state$ = observable({
  items: ["hi", "there", "hello"],
  selectedIndex: 0,
  selectedItem: computed(() => state$.items[state$.selectedIndex.get()]),
});

state$.selectedItem.get() === "hi"; // true

state$.selectedIndex.set(2);

state$.selectedItem.get() === "hello"; // true
```

### event

`event` works like an observable without a value. You can listen for changes as usual, and dispatch it manually whenever you want. This can be useful for simple events with no value, like onClosed.

```js
import { event } from "@legendapp/state"

const onClosed = event()

// Simply pass a callback to the `on` function
onClosed.on(() => { ... })

// Or use it with 'onChange' like other observables
onClosed.onChange(() => { ... })

// Dispatch the event to call listeners
onClosed.fire()
```

### proxy

`proxy` creates an observable object that is indexable by a string key, and creates a computed observable for each key.

```js
import { observable, proxy } from "@legendapp/state"

const state$ = observable({
  selector: 'text',
  items: { test1: { text: 'hi', othertext: 'bye' }, test2: { text: 'hello', othertext: 'goodbye' } },
    itemText: proxy((key) => {
    return state$.items[key][obs.selector.get()];
  }),
});

// Now these reference the same thing:
state$.items.test1.text.get()
state$.itemText.test1.get()
```

## Notes

### Safety

Observables are safe so that you cannot directly assign to them, which prevents accidentally overwriting state or accidentally assigning huge objects into an observable.

```js
const state$ = observable({ text: "hello", num: 10, obj: {} }, /*safe*/ true);

state$.text = "hi";
// ❌ Can't set directly

state$.text.set("hi");
// ✅ Calling set on a primitive works.

state$ = {};
// ❌ Error. This would delete the observable.

state$.obj = {};
// ❌ Error. Cannot assign to objects directly.

state$.set({ text: "hi", num: 20 });
// ✅ Calling set on an object works.

state$.assign({ text: "hello there" });
// ✅ Calling assign on an object works.

state$.text.assign({ value: "hello there" });
// ❌ Error. Cannot call assign on a primitive.
```

### undefined

Because observables track nodes [by path](../../intro/fast#proxy-to-path) and not the underlying data, an observable points to a path within an object regardless of its actual value. So it is perfectly fine to access observables when they are currently undefined in the object.

You could to do this to set up a listener to a field whenever it becomes available.

```jsx
const state$ = observable({ user: undefined });

when(state$.user.uid, (uid) => {
  // Handle login
});
```

Or you could set a value inside an undefined object, and it will fill out the object tree to make it work.

```jsx
const state$ = observable({ user: undefined });

observe(() => {
  // This will be undefined until the full user profile is set
  console.log(`Name: ${state$.user.profile.name.get()}`);
});

state$.user.profile.name.set("Annyong");

// state$ == { user: { profile: { name: 'Annyong' } } }
```

### Arrays

Observable arrays have all of the normal array functions as you'd expect, but some are modified for observables.

All looping functions set up [shallow tracking](../reactivity#shallow-modifier) automatically, as well as provide the observable in the callback. This includes:

- every
- filter
- find
- findIndex
- forEach
- includes
- join
- map
- some

Additionally, `filter` returns an array of observables and `find` returns an observable (or undefined).

If you don't want this extra observable behavior, `get()` or `peek()` the observable to get the raw array to act on.


## usage/reactivity

Listening for changes is the core purpose of observables, so Legend-State provides many options. You can listen to changes at any level in an object's hierarchy and it will be notified by changes in any children.

## Observing contexts

The core power of Legend-State is the "observing contexts". Calling `get()` within an observing context will track changes in that node, and re-run itself whenever it changes.

Most functions in Legend-State take what we call a "Selector", which either a single observable or a function that calls `get()` on some observables and returns a value.

### What tracks

`get()` is the primary way to access observables and track for changes, but there are actually a few ways:

1. Call `get()` on an observable: `settings.get()`
2. Array looping functions (shallow listener): `arr.map(settings.accounts, () => ...)`
3. Accessing array length (shallow listener): `if (arr.length > 0) ...`
4. Object.keys (shallow listener): `Object.keys(settings)`

These operation do not track:

1. Accessing through an observable: `state$.settings`
2. Call `peek()` on an observable: `settings.peek()`

### Observing examples

```js
const state$ = observable({
  settings: {
    theme: "dark",
  },
  chats: {
    messages: [{ id: 0, text: "hi" }],
  },
});

observe(() => {
  // Example 1:
  const theme = state$.settings.theme.get();
  // ✅ Tracking [state$.settings.theme] because of get()

  // Example 2:
  const settings = state$.settings;
  // ❌ Not tracking because it's an object

  const theme = settings.theme.get();
  // ✅ Tracking [state$.settings.theme] because of get()

  // Example 3:
  const theme$ = state$.settings.theme;
  // ❌ Not tracking with no get()

  // Example 4:
  state$.chats.messages.map((m) => <Message key={m.peek().id} message={m} />);
  // ✅ Tracking [state$.chats.messages (shallow)] because of map()

  // Example 5:
  Object.keys(state$.settings);
  // ✅ Tracking [state$.settings (shallow)]
});
```

The automatic behavior can be modified with two observable functions:

<div style={{ maxWidth: 300 }}>
  |Function | Tracked |
 | ----------- | ------- |
 | `get()` | yes |
 | `get(true)` | shallow |
 | `peek()` | no |
</div>

### get()

`get` returns the raw data of an observable and tracks it, so you can work with it without doing any further tracking. You may want to use `get()` to:

- Get the value of an observable wrapper of a primitive
- Track this object and not its individual fields. Minimizing the number of listeners is better for performance.

```js
const theme = state.settings.theme.get();
// ✅ Tracking [state.settings.theme]
```

### shallow modifier

`get()` observes recursively by default, so any child changing will cause an update. You can modify it to be a shallow listener by just adding a `true` parameter. This can be useful when a component only needs to re-render if an object's keys or an array's items change.

```jsx
const state$ = observable({ messages: [] });

observe(() => {
  // Only need this to update when messages added/removed
  const messages = state$.messages.get(true);

  console.log("Latest message", messages[0]);
});
```

### observe

`observe` can run arbitrary code when observables change, and automatically tracks the observables accessed while running, so it will update whenever any accessed observable changes.

This can be useful to use multiple observables at once, for the benefit of cleanup effects, or if you just like it more than [onChange](#onchange).

The callback parameter has some useful properties:

- `num`: How many times it's run. Use this to do something only the first time or not the first time.
- `previous`: The previous value, which will be undefined on the first run and set to the return value
- `cancel`: Set to `true` to stop tracking the observables when you are done observing
- `onCleanup`: A function to call before running the selector again

`observe` has an optional second `reaction` parameter which will run after the selector, and does not track changes. This can be useful for observing an `event` or a single `observable`.

```js
import { observe, observable } from "@legendapp/state";
const state$ = observable({ isOnline: false, toasts: [] });

const dispose = observe((e) => {
  // This observe will automatically track state.isOnline for changes
  if (!state$.isOnline.get()) {
    // Show an "Offline" toast when offline
    const toast = { id: "offline", text: "Offline", color: "red" };
    state$.toasts.push(toast);

    // Remove the toast when the observe is re-run, which will be when isOnline becomes true
    e.onCleanup = () => state$.toasts.splice(state$.toasts.indexOf(toast), 1);
  }
});

// Cancel the observe
dispose();
```

Or use the second parameter to run a reaction when a selector changes. It has an additional `value` parameter, which contains the value of the selector.

```js
// Observe the return value of a selector and observe all accessed observables
observe(state$.isOnline, (e) => {
  console.log("Online status", e.value);
});
// Observe the return value of a selector and observe all accessed observables
observe(
  () => state$.isOnline.get() && state$.user.get(),
  (e) => {
    console.log("Signed in status", e.value);
  }
);
```

### when

`when` runs the given function **only once** when the predicate returns a truthy value, and automatically tracks the observables accessed while running the predicate so it will update whenever one of them changes. When the value becomes truthy it will call the function and dispose the listeners. If not given a callback function it will return a promise that resolves when the predicate returns a truthy value.

The predicate can either be an observable or a function.

```js
import { observable, when } from "@legendapp/state";

const state$ = observable({ ok: false });

// Option 1: Promise
await when(state$.ok);

// Option 2: callback
const dispose = when(
  () => state$.ok.get(),
  () => console.log("Don't worry, it's ok")
);

// Cancel listening manually
dispose();
```

### whenReady

`whenReady` is the same as `when` except it waits for objects and arrays to not be empty.

```js
import { observable, whenReady } from "@legendapp/state";

const state$ = observable({ arr: [] });

whenReady(state$.arr, () => console.log("Array has some values"));
// Not ready yet

state$.arr.push("hello");

// "Array has some values"
```

### onChange

`onChange` listens to an observable for any changes anywhere within it. Use this as specifically as possible because it will fire notifications for every change recursively up the tree.

```js
import { observable } from "@legendapp/state";

const state$ = observable({ text: "hi" });

state$.text.onChange(({ value }) => console.log("text changed to", value));
state$.onChange(({ value }) => console.log("state changed to", value));

state$.text.set("hello");

// Log: text changed to "hello"
// Log: state changed to { text: "hello" }
```

`onChange` has some extra options for more advanced use:

1. `getPrevious`: Function to compare with the previous value. It is a function to let you opt into getting the previous value if needed, because it has some performance cost in cloning the object to compute the previous value.
2. `changes`: Array of all of the changes to this observable in the latest batch. This is intended mainly for internal usage by the persistence plugins to know what to sync/update and the history plugin to track all changes, but it may be good for other uses too.
3. `trackingType`: Whether to track only shallow changes
4. `initial`: Whether to run the callback immediately with the current value
5. `immediate`: Whether to run the callback immediately instead of within a batch. This is used internally by `computed` to make sure its value is always correct, but it may be useful for other specific uses.

```js
// Full example
state$.onChange(
  ({ value, getPrevious, changes }) => {
    const prev = getPrevious();
    changes.forEach(({ path, valueAtPath, prevAtPath }) => {
      console.log(valueAtPath, "changed at", path, "from", prevAtPath);
    });
  },
  { initial: true, trackingType: true }
);
```

#### Dispose of listeners

Listening to an observable returns a dispose function to stop listening. Just call it when you want to stop listening.

```js
const state$ = observable({ text: 'hello' })

const onChange = () => { ... }

const dispose = state$.text.onChange(onChange)

// Cancel listening manually
dispose()
```

