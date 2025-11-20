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
