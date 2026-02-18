## animated

<Callout>
These integrations are React Native only. On web, use standard DOM animation libraries or CSS transitions.
</Callout>

## Animated

AnimatedLegendList supports animated props with React Native's Animated.

```jsx
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { AnimatedLegendList } from "@legendapp/list/animated";

export function AnimatedExample() {
  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <AnimatedLegendList
      data={data}
      renderItem={renderItem}
      style={{ opacity: animated }}
    />
  );
}
```

Note that this is just a wrapper around the normal `createAnimatedComponent` so you can use that if you prefer.

```ts
const AnimatedLegendList = Animated.createAnimatedComponent(LegendList);
```

## Reanimated

The Reanimated version of AnimatedLegendList supports animated props with Reanimated. Note that using `Animated.createAnimatedComponent` will not work as it needs more boilerplate, so you should use this instead.

```jsx
import { useEffect } from "react";
import { AnimatedLegendList } from "@legendapp/list/reanimated";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

export function ReanimatedExample() {
  const scale = useSharedValue(0.8);

  useEffect(() => {
    scale.value = withSpring(1);
  }, []);

  return (
    <AnimatedLegendList
      data={data}
      renderItem={renderItem}
      style={useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
      }))}
    />
  );
}
```

## Keyboard Controller

LegendList integrates with the `KeyboardAvoidingView` in [react-native-keyboard-controller](https://github.com/kirillzyusko/react-native-keyboard-controller) for smoother keyboard interactions. Note that it is important to use `behavior="position"` for best compatibility with Legend List.

<Callout>
This integration is still evolving. If you need it asap please [post an issue](https://github.com/LegendApp/legend-docs/issues) or [talk to Jay on Twitter](https://twitter.com/jmeistrich).
</Callout>

```jsx
import { KeyboardAvoidingView, KeyboardProvider } from "react-native-keyboard-controller";
import { LegendList } from "@legendapp/list/keyboard-controller";

export function KeyboardControllerExample() {
  return (
    <KeyboardProvider>
      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={headerHeight}
      >
        <LegendList
          data={data}
          renderItem={renderItem}
          behavior="position"
        />
      </KeyboardAvoidingView>
    </KeyboardProvider>
  );
}
```


## components/section-list

Legend List ships a SectionList‑compatible component built on top of the LegendList virtualization core.

```tsx
import { SectionList } from "@legendapp/list/section-list";
```

## Quick example

```tsx
import { SectionList } from "@legendapp/list/section-list";

const sections = [
  { title: "A", data: ["Apple", "Avocado"] },
  { title: "B", data: ["Banana", "Blueberry"] },
];

export function MySectionList() {
  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item}
      renderSectionHeader={({ section }) => (
        <Header title={section.title} />
      )}
      renderItem={({ item }) => <Row label={item} />}
      stickySectionHeadersEnabled
      estimatedItemSize={48}
    />
  );
}
```

## Behavior and API

- Mirrors React Native’s SectionList props: `sections`, `renderSectionHeader`, `renderSectionFooter`, separators, `stickySectionHeadersEnabled`, and `scrollToLocation`.
- Accepts LegendList performance props like `recycleItems`, `maintainScrollAtEnd`, `drawDistance`, etc.
- Uses `stickyHeaderIndices` internally; you don’t pass it directly.

## scrollToLocation

```ts
ref.current?.scrollToLocation({
  sectionIndex: 2,
  itemIndex: 10,
  viewPosition: 0,
  viewOffset: 12,
  animated: true,
});
```

## Limitations

- `horizontal` disables sticky section headers.
- `numColumns` and `columnWrapperStyle` are not supported (SectionList is always one column).
- `stickyHeaderIndices` is managed internally.

See [Props](../../props) for shared LegendList props.


## examples/always-render

Use `alwaysRender` to keep selected items mounted even when they scroll out of view.

```tsx
import { LegendList } from "@legendapp/list";

const data = Array.from({ length: 100 }, (_, i) => ({ id: String(i), title: `Item ${i + 1}` }));

export function AlwaysRenderExample() {
  return (
    <LegendList
      data={data}
      keyExtractor={(item) => item.id}
      estimatedItemSize={48}
      alwaysRender={{ top: 2, bottom: 2 }}
      renderItem={({ item, index }) => (
        <Row label={item.title} pinned={index < 2 || index >= data.length - 2} />
      )}
    />
  );
}
```

`alwaysRender` accepts:
- `top` / `bottom`: keep the first/last N items mounted
- `indices`: explicit indices to keep mounted
- `keys`: keep specific keys mounted (requires `keyExtractor`)


## examples/chat-interfaces

## Chat Interfaces Without `inverted`

In other list libraries if you wanted items to start scrolling from the bottom, you'd need to use an `inverted` prop, which would apply a negative scale transform. But that causes a lot of weird issues, so Legend List explicitly does not do that.

```ts
alignItemsAtEnd?: boolean;
maintainScrollAtEnd?: boolean;
maintainScrollAtEndThreshold?: number;
```

Instead, to align items at the end you can just use the `alignItemsAtEnd` prop, which will apply padding above items to fill the screen and stick them to the bottom.

The `maintainScrollAtEnd` prop will check if you are already scrolled to the bottom when `data` changes, and if so it keeps you scrolled to the bottom.

The `maintainScrollAtEndThreshold` prop (which defaults to 0.1) defines what percent of the screen counts as the bottom.

So using Legend List for a chat interface would look like this:

```tsx
  <LegendList
    data={items}
    renderItem={({ item }) => <Text>{item.title}</Text>}
    estimatedItemSize={320}
    alignItemsAtEnd
    maintainScrollAtEnd
    maintainScrollAtEndThreshold={0.1}
  />
```


## examples/infinite-scrolling

## Two-way infinite scrolling

```ts
onStartReached?: ((info: { distanceFromStart: number }) => void) | null | undefined;
onStartReachedThreshold?: number;
onEndReached?: ((info: { distanceFromEnd: number }) => void) | null | undefined;
onEndReachedThreshold?: number;
```

These callbacks fire when you scroll to the top or bottom of a list. This can be used to load more data in either direction. In a typical list you'll likely just use `onEndReached` to load more data when the users scrolls to the bottom.

If you have a chat-like interface you may want to load more messages as you scroll up, and you can use `onStartReached` for that. If you are doing that, you will very likely want to use [maintainVisibleContentPosition](../../props#maintainvisiblecontentposition) with `data: true` so that the items loading above don't shift the viewport down.

## Example Implementation

```tsx
import { LegendList } from "@legendapp/list";
import { useState, useCallback } from "react";

export function InfiniteScrollExample() {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const loadMoreAtEnd = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      const newItems = await fetchMoreItems(data.length);
      setData(prev => [...prev, ...newItems]);
    } finally {
      setLoading(false);
    }
  }, [data.length, loading]);

  const loadMoreAtStart = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      const newItems = await fetchPreviousItems(data[0]?.id);
      setData(prev => [...newItems, ...prev]);
    } finally {
      setLoading(false);
    }
  }, [data, loading]);

  return (
    <LegendList
      data={data}
      renderItem={({ item }) => <MessageItem item={item} />}
      keyExtractor={item => item.id}
      onEndReached={loadMoreAtEnd}
      onStartReached={loadMoreAtStart}
      onEndReachedThreshold={0.5}
      onStartReachedThreshold={0.5}
      maintainVisibleContentPosition={{ data: true }}
      recycleItems
    />
  );
}
```


## getting-started-web

Legend List runs natively on the web with DOM elements. You do **not** need React Native or react-native-web to use it.

- ⚡️ Virtualized, fast scrolling lists in React
- 🧠 Dynamic item sizes
- 🧩 Same API as the React Native version

<Callout>
Looking for the React Native version? Start with <a href="../getting-started">Getting Started (React Native)</a>.
</Callout>

## Install

```npm
npm install @legendapp/list
```

## Usage

On web, `renderItem` should return DOM elements (e.g. `div`). Your list needs a height, either directly or via a parent with a fixed height.

```jsx
import { LegendList } from "@legendapp/list";

const items = Array.from({ length: 1000 }, (_, i) => ({
  id: String(i),
  title: `Item ${i + 1}`,
}));

export function WebList() {
  return (
    <div style={{ height: 480, border: "1px solid #e5e7eb" }}>
      <LegendList
        data={items}
        keyExtractor={(item) => item.id}
        estimatedItemSize={44}
        renderItem={({ item }) => (
          <div style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>
            {item.title}
          </div>
        )}
        style={{ height: "100%" }}
      />
    </div>
  );
}
```

### Important layout notes

- The scroll container must have a height. Use a fixed height, or a flex parent with a set height.
- `style` and `contentContainerStyle` accept CSS properties on web.
- If you are rendering inside a flex layout, be sure the list can actually shrink (e.g. `minHeight: 0` on the parent).

### TypeScript note

Legend List’s types reference `react-native` for shared types. If your TS setup complains about missing `react-native` types, add `react-native` as a dev dependency or provide a minimal module stub.

See [Props](../props) for the shared API and platform-specific callouts.


## getting-started

Legend List is a high performance virtualized list for React Native. Compared to FlatList and FlashList it's faster, simpler, and supports dynamic item sizes without hacks.

- ✨ Extremely fast
- ✨ Dynamic item sizes
- ✨ Optional recycling
- ✨ Bidirectional infinite lists
- ✨ Chat list without inverting
- ✨ Maintain content view position
- ✨ Recycling hooks

<Callout>
Building for the web? Start with <a href="../getting-started-web">Getting Started (Web)</a> instead.
</Callout>

For more information, check out:
- [Legend List: Optimizing for Mobile & Web | React Universe Conf 2025](https://www.youtube.com/watch?v=Ui3qVl80Pzg)
- [Legend List: Optimizing for Peak List Performance | App.js Conf 2025](https://www.youtube.com/watch?v=4nfxSE9OByQ)
- [Jay's conversation on React Native Radio](https://infinite.red/react-native-radio/rnr-325-legend-list-with-jay-meistrich)

## It's fast!

This video was recorded as a performance test scrolling ludicrously fast with heavy items. LegendList handles expensive components with a quick recovery.

<div className="w-[800px] max-w-full mx-auto rounded-xl overflow-hidden">
    <video
        src="/open-source/assets/legendlist2.mp4"
        controls
        width="100%"
        height="100%"
        autoPlay
        loop
        muted
        className="rounded-xl"
    />
</div>

<br />

## It uses less resources

A FlashLight measurement of the above test shows that LegendList uses less CPU while scrolling. And it uses less memory too! See the [FlashLight results](/open-source/list/flashlight.html) for more details.

<img src="/open-source/list/flashlight.png" className="w-[800px] max-w-full mx-auto mt-8 rounded-xl overflow-hidden border border-fd-border" />

## Install

```npm
npm install @legendapp/list
```

## Usage

Legend List is a drop-in replacement for FlatList or FlashList. It only renders the items that are in view, which significantly reduces render cost for long lists.

### Quick Start

```jsx
import { Text } from "react-native";
import { LegendList } from "@legendapp/list";

const items = [
  { id: "1", title: "Item 1" },
  { id: "2", title: "Item 2" },
  { id: "3", title: "Item 3" },
];

export function MyList() {
  return (
    <LegendList
      data={items}
      renderItem={({ item }) => <Text>{item.title}</Text>}
      keyExtractor={(item) => item.id}
      recycleItems
    />
  );
}
```

### Switch from FlashList

If you're coming from FlashList, in most cases you can just rename the component and it will work as expected. Legend List does not recycle items by default, so to match FlashList's behavior you can enable `recycleItems`.

```diff
return (
-  <FlashList
+  <LegendList
      data={items}
      renderItem={({ item }) => <Text>{item.title}</Text>}
+     recycleItems
  />
)
```

### Switch from FlatList

Legend List should immediately be much faster. But you may want to add the `recycleItems` prop for extra performance.

```diff
return (
-  <FlatList
+  <LegendList
      data={items}
      renderItem={({ item }) => <Text>{item.title}</Text>}
+     recycleItems
  />
)
```

See [Props](../props) for all properties of LegendList.

## Supported Platforms

- Android
- iOS
- React Native MacOS
- React Native Windows
- TV platforms
- Any React Native platform should work since there's no native code, but if not please let us know!

## Community

Join us on [Discord](https://discord.gg/5CBaNtADNX) or [Github](https://github.com/LegendApp/legend-list) to get involved with the Legend community.

Talk to Jay on [Bluesky](https://bsky.app/profile/jayz.us) or [Twitter](https://twitter.com/jmeistrich).

## Contributing

We welcome contributions! Please read our [Contributing Guide](https://github.com/LegendApp/legend-list) on Github. And we welcome documentation PRs in our [documentation repo](https://github.com/LegendApp/legend-docs).

## Legend Kit

Legend Kit is our early but growing collection of high performance headless components, general purpose observables, transformer computeds, React hooks that don't re-render, and observable tools for popular frameworks. [Check out Legend Kit](https://www.legendapp.com/kit) to learn more.


## overview

<Callout>
Version 3 is currently **beta**. The React Native API is stable; web support is new and evolving.
</Callout>

Legend List is a high‑performance, virtualized list for **React Native and Web**. It’s a drop‑in replacement for FlatList/FlashList on mobile and a fast, DOM‑native list on the web.

- ✨ Dynamic item sizes
- ⚡️ High performance virtualization
- 🧲 Sticky headers and SectionList support
- 🔁 Optional recycling
- 💬 Built for chat and infinite scroll

## Choose your platform

- **React Native** → [Getting Started (React Native)](../getting-started)
- **Web** → [Getting Started (Web)](../getting-started-web)

## What’s new in v3

- Web support (no React Native dependency required)
- SectionList component (`@legendapp/list/section-list`)
- `alwaysRender` for keeping selected items mounted
- New `maintainVisibleContentPosition` configuration
- `stickyHeaderIndices` (with `stickyIndices` deprecated)

Read the full change summary in [Version 3](../version-3).


## performance

Legend List is very optimized by default, so it may already be working well without any configuration. But these are some common ways to improve your list behavior.

It's important to provide an `estimatedItemSize` (if items are the same size or all dynamic sizes) or `getEstimatedItemSize` (if items are different known sizes). Legend List uses this as the default item size, then as items are rendered it updates their positions with the actual size. So getting this estimate as close as possible to the real size will reduce layout shifting and blank spaces as items render. If not provided it will use `100px` as the default.

The `onItemSizeChanged` event can also help with your estimations - it will be called whenever an item's size changes. So you can use it to log what the actual rendered size is to adjust your estimates.

### Use `keyExtractor` Prop

```ts
keyExtractor?: (item: T, index: number) => string;
```

The `keyExtractor` prop lets Legend List save item layouts by key, so that if the `data` array changes it can reuse previous layout information and only update the changed items. Without `keyExtractor`, item sizes will reset to their default whenever `data` changes. So it is *very recommended* to have a `keyExtractor` if `data` ever changes. If your items are a fixed size, providing a `keyExtractor` that returns the index will tell it to reuse size information.

### Recycling List Items

```ts
recycleItems?: boolean // default: false
```

Legend List has an optional `recycleItems` prop which enables view recycling. This will reuse the component rendered by your `renderItem` function. This can be a big performance optimization because it does not need to destroy/create views while scrolling. But it also reuses any local state, which can cause some weird behavior that may not be desirable depending on your app. But see the [recycling hooks](../props#userecyclingstate) to make that easier.

So there are some tradeoffs with recycling:

- 👍 If you have items with no state then recycling should be great
- 👎 If you have simple items with complex state then it may be more trouble than it's worth
- 👍 If you have heavy items with complex state then working around the state recycling may be worth it for the performance gains

### Estimate Item Sizes

```ts
estimatedItemSize?: number;
getEstimatedItemSize?: (item: T, index: number, itemType?: string) => number;
getFixedItemSize?: (item: T, index: number, itemType?: string) => number | undefined;
onItemSizeChanged?: (info: {
        size: number;
        previous: number;
        index: number;
        itemKey: string;
        itemData: ItemT;
    }) => void;
```

If your list elements are a fixed size, then use `getFixedItemSize` to skip all of the work of measuring and adjusting items.

Providing accurate item size estimates helps determine the number of containers to allocate, based on screen size / estimatedItemSize. `estimatedItemSize` is used only for the first render, then Legend List switches to using the average of actually rendered item sizes. If you provide `getEstimatedItemSize`, it will use that function instead of averages. The more accurate your initial estimates, the better the first render experience.

Use `onItemSizeChanged` to log actual vs estimated sizes and improve your estimates over time. It's generally better to slightly underestimate than overestimate item sizes. Without estimates, Legend List defaults to 100px which will likely cause scrollbar jumping and layout issues.

### Keep Specific Items Mounted

```ts
alwaysRender?: { top?: number; bottom?: number; indices?: number[]; keys?: string[] };
```

Use `alwaysRender` to keep important items mounted even when they scroll out of view (e.g., pinned headers, chat sentinels). This slightly increases render work, so use it sparingly for the items that truly need to stay mounted.

### Set DrawDistance Prop

```ts
drawDistance?: number // default: 250
```

The `drawDistance` (defaults to `250`) is the buffer size in pixels above and below the viewport that will be rendered in advance. So for example if your screen is `2000px` tall and your draw distance is `1000`, then it will render double your screen size, from `-1000px` above the viewport to `1000px` below the viewport.

This can help reduce the amount of blank space while scrolling quickly. But if your items are computationally expensive, it may reduce performance because more items are rendering at once. So you should experiment with it to find the most optimal behavior for your app.


### Set `waitForInitialLayout` Prop

```ts
waitForInitialLayout?: boolean // default: true
```

If the size of your list items differs significantly from the estimate, you may see a layout jump after the first render. If so, the `waitForInitialLayout` prop solves that by delaying displaying list items by one frame so they start at the correct position. But, if you have fixed sized items then you may not want to disable it to avoid waiting a frame.


## props

Below is a list of all the properties for LegendList:

<Callout>
Props apply to both React Native and Web unless otherwise noted. Platform-specific notes are called out inline.
</Callout>

## Required Props
___
### data

```ts
data: ItemT[];
```

An array of the items to render. This can also be an array of keys if you want to get the item by key in [renderItem](#renderitem).

### renderItem

```ts
renderItem?: (props: { item: ItemT; index: number; extraData: any; type?: string; data: ItemT[] }) => ReactNode;
```

Takes an item from data and renders it into the list. The `type` parameter is available when using `getItemType`.

See [React Native Docs](https://reactnative.dev/docs/flatlist#renderItem).

<br />

## Recommended Props
___
### keyExtractor

```ts
keyExtractor?: (item: ItemT, index: number) => string;
```

Highly recommended. The `keyExtractor` prop lets Legend List save item layouts by key, so that if the `data` array changes it can reuse previous layout information and only update the changed items. The value it returns should be unique to each item - if a value is reused for a different item it will cause big problems. It is okay to return the index, if list items are reordered or prepended, it will also cause big problems. See [Use key extractor](../performance#use-keyextractor).

If LegendList detects duplicate keys, it will log a warning.

### recycleItems

```ts
recycleItems?: boolean; // default: false
```

This will reuse the component rendered by your `renderItem` function. This can be a big performance improvement, but if your list items have internal state there's potential for undesirable behavior. For more information, see [Performance](../performance#recycling-list-items) for more information.

<br />

## Optional Props

___

### alignItemsAtEnd
```ts
alignItemsAtEnd?: boolean; // default: false
```

Aligns to the end of the screen. If there's only a few items, Legend List will add padding to the top to align them to the bottom. See [Chat interfaces without inverted](../examples/chat-interfaces) for more.

### alwaysRender

```ts
alwaysRender?: { top?: number; bottom?: number; indices?: number[]; keys?: string[] };
```

Keeps selected items mounted even when they scroll out of view. Use this for pinned items or sentinels. `keys` requires a stable `keyExtractor`.

### columnWrapperStyle

```ts
columnWrapperStyle?: StyleProp<ViewStyle>;
```

Style applied to each column's wrapper view.

### contentContainerStyle

```ts
contentContainerStyle?: StyleProp<ViewStyle>;
```

Style applied to the underlying ScrollView's content container.
On web, this maps to the inner content div’s CSS styles.

### contentInset

```ts
contentInset?: { top: number; left: number; bottom: number; right: number };
```

React Native only. Sets ScrollView content insets. On web, prefer padding via `contentContainerStyle` or `style`.

### drawDistance

```ts
drawDistance?: number;
```

The `drawDistance` (defaults to `250`) is the buffer size in pixels above and below the viewport that will be rendered in advance. See [Performance](../performance#set-drawdistance-prop) for more.

### estimatedItemSize

```ts
estimatedItemSize?: number;
```

An estimated size for all items which is used to estimate the list layout before items actually render. This can help to provide a hint for how large items will be in the first frame and can speed up initial layout, but subsequent renders will use the average item size.

### extraData

```ts
extraData?: any;
```

Extra data to trigger re-rendering when changed.

See [React Native Docs](https://reactnative.dev/docs/flatlist#extraData).

### dataVersion

```ts
dataVersion?: Key;
```

Version token that forces the list to treat data as updated even when the array reference is stable. Increment this when mutating `data` in place.

### getEstimatedItemSize

```ts
getEstimatedItemSize?: (item: ItemT, index: number, itemType?: string) => number;
```

An estimated size for each item which is used to estimate the list layout before items actually render. If you don't provide this, it will log a suggested value for optimal performance.

### getFixedItemSize

```ts
getFixedItemSize?: (item: ItemT, index: number, itemType?: string) => number | undefined;
```

For items with known fixed sizes, this enables optimal performance as it disables the overhead of measuring and updating item size. Return a number for fixed-size items or undefined for dynamic-size items.

### getItemType

```ts
getItemType?: (item: ItemT, index: number) => string;
```

Allows categorizing different item types for better performance optimization. Items with the same type can be recycled more efficiently.

### horizontal

```ts
horizontal?: boolean; // default: false
```

Renders all items in the list in horizontal.

### initialContainerPoolRatio

```ts
initialContainerPoolRatio?: number; // default: 2
```

Ratio of initial container pool size to data length. The container pool is extra unallocated containers that are used in case the actual size is smaller than the estimated size. This defaults to `2` which we've found to cover most usage. If your items are a fixed size you could set it closer to `1`, or if your items or viewport can resize signficantly it may help to increase it. If the number of containers needed exceeds the pool, LegendList will allocate more containers and re-render the outer list, which may cause a frame stutter.

### initialScrollIndex

```ts
initialScrollIndex?: number | { index: number; viewOffset?: number; viewPosition?: number };
```

Start scrolled with this item at the top (or at the provided `viewPosition`). If item sizes are dynamic, the list will adjust after measurement using the default scroll‑stabilization behavior.

### initialScrollOffset

```ts
initialScrollOffset?: number;
```

Start scrolled to this offset.

### initialScrollAtEnd

```ts
initialScrollAtEnd?: boolean; // default: false
```

When true, the list initializes scrolled to the last item. Overrides `initialScrollIndex` and `initialScrollOffset` when data is available.

### ItemSeparatorComponent

```ts
ItemSeparatorComponent?: React.ComponentType<{ leadingItem: ItemT }>
```

Rendered in between each item, but not at the top or bottom.

See [React Native Docs](https://reactnative.dev/docs/flatlist#itemseparatorcomponent).

### ListEmptyComponent

```ts
ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null | undefined;
```
Rendered when the list is empty.

See [React Native Docs](https://reactnative.dev/docs/flatlist#listemptycomponent).

### ListEmptyComponentStyle

```ts
ListEmptyComponentStyle?: StyleProp<ViewStyle> | undefined;
```
Styling for internal View for `ListEmptyComponent`.


### ListFooterComponent

```ts
ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null | undefined;
```
Rendered at the bottom of all the items.

See [React Native Docs](https://reactnative.dev/docs/flatlist#listfootercomponent).


### ListFooterComponentStyle

```ts
ListFooterComponentStyle?: StyleProp<ViewStyle> | undefined;
```
Styling for internal View for `ListFooterComponent`.

See [React Native Docs](https://reactnative.dev/docs/flatlist#listfootercomponentstyle).

### ListHeaderComponent

```ts
ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null | undefined;
```
Rendered at the top of all the items.

See [React Native Docs](https://reactnative.dev/docs/flatlist#listheadercomponent).

### ListHeaderComponentStyle

Styling for internal View for `ListHeaderComponent`.

See [React Native Docs](https://reactnative.dev/docs/flatlist#listheadercomponentstyle).


### maintainScrollAtEnd

```ts
maintainScrollAtEnd?: boolean;
```

This will check if you are already scrolled to the bottom when `data` changes, and if so it keeps you scrolled to the bottom.

See [Chat interfaces without `inverted`](../examples/chat-interfaces) for more.

### maintainScrollAtEndThreshold

```ts
maintainScrollAtEndThreshold?: number;
```

This defines what percent of the screen counts as the bottom. Defaults to `0.1`.

See [Chat interfaces without `inverted`](../examples/chat-interfaces) for more.

### maintainVisibleContentPosition

```ts
maintainVisibleContentPosition?: boolean | {
  data?: boolean;
  size?: boolean;
  shouldRestorePosition?: (item: ItemT, index: number, data: ItemT[]) => boolean;
};
```

Controls how the list stabilizes scroll position when items above the viewport change.

- `size` (default: true): stabilizes during size/layout changes while scrolling
- `data` (default: false): anchors when the data array changes
- `shouldRestorePosition`: return `false` to skip anchoring for specific items

Passing `true` enables both `size` and `data`. Passing `false` disables both.

React Native note: when `data` anchoring is enabled, LegendList uses ScrollView’s [maintainVisibleContentPosition](https://reactnative.dev/docs/scrollview#maintainvisiblecontentposition) under the hood. Android requires React Native 0.72+ for that prop.

### numColumns

```ts
numColumns?: number;
```

Multiple columns will zig-zag like a flexWrap layout. Rows will take the maximum height of their columns, so items should all be the same height - masonry layouts are not supported.

### onEndReached

```ts
onEndReached?: ((info: { distanceFromEnd: number }) => void) | null | undefined;
```

A callback that's called only once when scroll is within `onEndReachedThreshold` of the bottom of the list. It resets when scroll goes above the threshold and then will be called again when scrolling back into the threshold.

### onEndReachedThreshold

```ts
onEndReachedThreshold?: number | null | undefined;
```

The distance from the end as a percentage that the scroll should be from the end to trigger `onEndReached`. It is multiplied by screen size, so a value of 0.5 will trigger `onEndReached` when scrolling to half a screen from the end.

### onItemSizeChanged

```ts
onItemSizeChanged?: (info: {
        size: number;
        previous: number;
        index: number;
        itemKey: string;
        itemData: ItemT;
    }) => void;
```

Called whenever an item's rendered size changes. This can be used to adjust the estimatedItemSize to match the actual size, which can improve performance or reduce layout shifting.

### onMetricsChange

```ts
onMetricsChange?: (metrics: { headerSize: number; footerSize: number }) => void;
```

Called when list layout metrics change (header or footer size updates).

### onRefresh

```ts
onRefresh?: () => void;
```

React Native only. Called whenever a user pulls down to refresh. See [React Native Docs](https://reactnative.dev/docs/flatlist#onRefresh).

### onStartReached

```ts
onStartReached?: ((info: { distanceFromStart: number }) => void) | null | undefined;
```

A callback that's called only once when scroll is within `onStartReachedThreshold` of the top of the list. It resets when scroll goes below the threshold and then will be called again when scrolling back into the threshold.

### onStartReachedThreshold

```ts
onStartReachedThreshold?: number | null | undefined;
```

The distance from the start as a percentage that the scroll should be from the end to trigger `onStartReached`. It is multiplied by screen size, so a value of 0.5 will trigger `onStartReached` when scrolling to half a screen from the start.

### onViewableItemsChanged

```ts
onViewableItemsChanged?: OnViewableItemsChanged | undefined;
```

Called when the viewability of rows changes, as defined by the `viewabilityConfig` prop.

See [React Native Docs](https://reactnative.dev/docs/flatlist#onviewableitemschanged).


### progressViewOffset

```ts
progressViewOffset?: number | undefined;
```

React Native only. Offset in pixels for the refresh indicator.

### ref

```ts
ref?: LegendListRef;
```

Used to call `scrollTo` [methods](#ref-methods).

### refreshing

```ts
refreshing?: boolean;
```

React Native only. Set this true while waiting for new data from a refresh.

See [React Native Docs](https://reactnative.dev/docs/flatlist#refreshing).

### renderScrollComponent

```ts
renderScrollComponent?: (props: ScrollViewProps) => ReactNode
```

React Native only. Render a custom ScrollView component. This allows customization of the underlying ScrollView.

Note that passing `renderScrollComponent` as an inline function might cause you to lose scroll position if the list is rerendered.

```tsx
renderScrollComponent={(props) => <BottomSheetScrollView {...props} />}
```

Instead, it's better to extract it as a custom component.

```tsx
const CustomScrollView = (props: ScrollViewProps) => {
  return <BottomSheetScrollView {...props} />;
};
```

### snapToIndices

```ts
snapToIndices?: number[];
```

An array of indices that the scroll position can snap to. When scrolling stops near one of these indices, the scroll position will automatically adjust to align with that item.

### stickyHeaderIndices

```ts
stickyHeaderIndices?: number[];
```

An array of indices for items that should stick to the top of the list while scrolling. Sticky headers remain visible at the top of the viewport as you scroll past them.
Not supported with `horizontal={true}`.

### stickyIndices (deprecated)

```ts
stickyIndices?: number[];
```

Deprecated alias for `stickyHeaderIndices`.

### style

```ts
style?: StyleProp<ViewStyle>;
```

Style applied to the underlying ScrollView. On web this maps to the scroll container’s CSS style.

### viewabilityConfig

```ts
viewabilityConfig?: ViewabilityConfig;
```

Configuration for when to update the `onViewableItemsChanged` callback.

See [React Native Docs](https://reactnative.dev/docs/flatlist#viewabilityconfig).

### viewabilityConfigCallbackPairs

```ts
viewabilityConfigCallbackPairs?: ViewabilityConfigCallbackPairs | undefined;
```

List of `ViewabilityConfig`/`onViewableItemsChanged` pairs. A specific `onViewableItemsChanged` will be called when its corresponding `ViewabilityConfig`'s conditions are met.

See [React Native Docs](https://reactnative.dev/docs/flatlist#viewabilityconfigcallbackpairs).

### waitForInitialLayout

```ts
waitForInitialLayout?: boolean; // default true
```

If true, delays rendering until initial layout is complete

<br />

## Ref Methods
___

### getState

```ts
getState: () => {
    activeStickyIndex: number;
    contentLength: number;
    data: ItemT[];
    elementAtIndex: (index: number) => View | null | undefined;
    end: number;
    endBuffered: number;
    isAtEnd: boolean;
    isAtStart: boolean;
    listen: (type: string, callback: (value: any) => void) => () => void;
    listenToPosition: (key: string, callback: (value: number) => void) => () => void;
    positionAtIndex: (index: number) => number;
    positions: Map<string, number>;
    scroll: number;
    scrollLength: number;
    scrollVelocity: number;
    sizeAtIndex: (index: number) => number;
    sizes: Map<string, number>;
    start: number;
    startBuffered: number;
}
```

Returns the internal scroll state of the list for advanced integrations. Includes element access, listeners, and scroll velocity.

### scrollToIndex

```ts
scrollToIndex: (params: {
  index: number;
  animated?: boolean;
  viewOffset?: number;
  viewPosition?: number;
});
```

Scrolls to the item at the specified index. For the most accurate results, provide good size estimates via [getEstimatedItemSize](#getestimateditemsize) or [getFixedItemSize](#getfixeditemsize). Size stabilization is enabled by default for dynamic items.

### scrollToOffset

```ts
scrollToOffset(params: {
  offset: number;
  animated?: boolean;
});
```

Scroll to a specific content pixel offset in the list.

Valid parameters:

- *offset* (number) - The offset to scroll to. In case of horizontal being true, the offset is the x-value, in any other case the offset is the y-value. Required.
- *animated* (boolean) - Whether the list should do an animation while scrolling. Defaults to true.

### scrollToItem

```ts
scrollToItem(params: {
  animated?: boolean,
  item: Item,
  viewOffset?: number;
  viewPosition?: number;
});
```

Requires linear scan through data - use [scrollToIndex](#scrolltoindex) instead if possible. Provided for compatibility with FlatList only.

Valid parameters:

- *animated* (boolean) - Whether the list should do an animation while scrolling. Defaults to true.
- *item* (object) - The item to scroll to. Required.

### scrollToEnd

```ts
scrollToEnd(params?: {
  animated?: boolean,
  viewOffset?: number,
});
```

Scrolls to the end of the list.

Valid parameters:

- *animated* (boolean) - Whether the list should do an animation while scrolling. Defaults to true.

### scrollIndexIntoView

Scrolls the index into view. If the index is above the viewable range it will be scrolled to the top of the screen, and if it's below the viewable range it will be scrolled to the bottom of the screen.

```ts
scrollIndexIntoView(params: {
  animated?: boolean | undefined;
  index: number;
}): void
```

```jsx
import { useRef } from "react";
import { Button } from "react-native";
import { LegendList } from "@legendapp/list";

export function ScrollExample() {
  const listRef = useRef(null);

  const scrollToItem = () => {
    // Scroll to the item at index 10
    listRef.current?.scrollIndexIntoView({ index: 10 });
  };

  return (
    <>
      <Button title="Scroll to item 10" onPress={scrollToItem} />
      <LegendList
        ref={listRef}
        data={data}
        renderItem={renderItem}
      />
    </>
  );
}
```

### scrollItemIntoView

Scrolls the item into view. If the item is above the viewable range it will be scrolled to the top of the screen, and if it's below the viewable range it will be scrolled to the bottom of the screen.

```ts
scrollItemIntoView(params: {
  animated?: boolean | undefined;
  item: any;
}): void;
```

```jsx
import { useRef } from "react";
import { Button } from "react-native";
import { LegendList } from "@legendapp/list";

export function ScrollToItemExample() {
  const listRef = useRef(null);
  const targetItem = { id: "item-5", text: "Target Item" };

  const scrollToSpecificItem = () => {
    // Scroll to the item that matches targetItem
    listRef.current?.scrollItemIntoView({ item: targetItem });
  };

  return (
    <>
      <Button title="Scroll to target item" onPress={scrollToSpecificItem} />
      <LegendList
        ref={listRef}
        data={data}
        renderItem={renderItem}
      />
    </>
  );
}
```

### setVisibleContentAnchorOffset

```ts
setVisibleContentAnchorOffset(value: number | ((current: number) => number)): void;
```

Adjusts the internal anchor offset used by `maintainVisibleContentPosition`. Useful for advanced scroll anchoring behavior.

### setScrollProcessingEnabled

```ts
setScrollProcessingEnabled(enabled: boolean): void;
```

Enables or disables scroll processing. Useful when you need to temporarily opt out of list virtualization behavior.

### reportContentInset

```ts
reportContentInset(inset?: { top?: number; left?: number; bottom?: number; right?: number } | null): void;
```

Reports an externally measured content inset (merged with props/native insets). Pass `null`/`undefined` to clear.

<br />

## Hooks

### useRecyclingState

```ts
interface LegendListRecyclingState<T> {
    item: T;
    prevItem: T | undefined;
    index: number;
    prevIndex: number | undefined;
}
useRecyclingState: <T>(updateState: ((info: LegendListRecyclingState<T>) => T) | T) => [T, Dispatch<T>];
```

`useRecyclingState` automatically resets the state when an item is recycled into a new item.

```tsx
import { useRecyclingState } from "@legendapp/list"
export function ItemComponent({ item }) {
    // Like useState but it resets when the item is recycled
    const [isExpanded, setIsExpanded] = useRecyclingState(() => false);

    // ...
}
```

### useRecyclingEffect

```ts
interface LegendListRecyclingState<T> {
    item: T;
    prevItem: T | undefined;
    index: number;
    prevIndex: number | undefined;
}
useRecyclingEffect: <T>(effect: (info: LegendListRecyclingState<T>) => void | (() => void)) => void;
```

`useRecyclingEffect` can be used to reset any side effects when an item gets recycled.

```tsx
import { useRef } from "react";
import { useRecyclingEffect } from "@legendapp/list"

export function ItemComponent({ item }) {
    const refSwipeable = useRef(null);
    const refVideo = useRef(null);
    // A callback when the item is recycled into a new item
    useRecyclingEffect(({ item, prevItem, index, prevIndex }) => {
        // Reset any side effects from the previous item
        refSwipeable?.current?.close();
        refVideo?.current?.reset();
    });

    // ...
}
```

### useViewability

```ts
interface ViewToken<ItemT = any> {
    containerId: number;
    index: number;
    isViewable: boolean;
    item: ItemT;
    key: string;
}
useViewability: (configId: string, callback: (viewToken: ViewToken) => void) => void;
```

A hook that provides callbacks when an item's viewability changes. This hook registers a callback that will be invoked whenever the item's visibility status changes, providing detailed information about the item through the ViewToken interface. It is similar to [onViewableItemsChanged](#onviewableitemschanged) but runs for only the rendering item. If you defined multiple viewability configs using [viewabilityConfigCallbackPairs](#viewabilityconfigcallbackpairs) then provide the id of the one you're interested in with `configId`.

```tsx
import { useState } from "react";
import { View, Text } from "react-native";
import { useViewability } from "@legendapp/list"

export function ItemComponent({ item }) {
    const [isVisible, setIsVisible] = useState(false);

    useViewability((viewToken) => {
        // Called when viewability changes
        setIsVisible(viewToken.isViewable);

        if (viewToken.isViewable) {
            console.log("Item visible:", viewToken.item);
            console.log("Item index:", viewToken.index);
        }
    }, "main");

    return (
        <View>
            {isVisible ? <ExpensiveComponent /> : <PlaceholderComponent />}
        </View>
    );
}
```

### useViewabilityAmount

```ts
interface ViewAmountToken<ItemT = any> {
    containerId: number;
    index: number;
    isViewable: boolean;
    item: ItemT;
    key: string;
    percentOfScroller: number;
    percentVisible: number;
    scrollSize: number;
    size: number;
    sizeVisible: number;
}

useViewabilityAmount: (callback: (viewAmountToken: ViewAmountToken) => void) => void;
```

A hook that provides detailed metrics about how much of an item is visible in the viewport. The callback receives a ViewAmountToken with information like the pixel measurements (sizeVisible, size), percentage visible, and more.

```tsx
import { useState } from "react";
import { Animated, Text } from "react-native";
import { useViewabilityAmount } from "@legendapp/list"

export function ItemComponent({ item }) {
    const [opacity, setOpacity] = useState(0);

    useViewabilityAmount((viewAmountToken) => {
        // Get detailed visibility information
        setOpacity(viewAmountToken.percentVisible);

        // Additional metrics available:
        // viewAmountToken.sizeVisible - pixels of item visible in viewport
        // viewAmountToken.size - total size of the item
        // viewAmountToken.percentOfScroller - what percent of the scroller this item takes up
        // viewAmountToken.scrollSize - size of the viewport
    });

    return (
        <Animated.View style={{ opacity }}>
            <Text>{item.title}</Text>
        </Animated.View>
    );
}
```

### useSyncLayout

```ts
useSyncLayout: (callback: () => void) => void;
```

A hook for synchronizing layout operations. This is useful for advanced use cases where you need to coordinate layout updates with other components or operations.

```tsx
import { View, Text } from "react-native";
import { useSyncLayout } from "@legendapp/list"

export function ItemComponent({ item }) {
    useSyncLayout(() => {
        // This callback will be called when layout operations are synchronized
        console.log("Layout synchronized for item:", item.id);
    });

    return (
        <View>
            <Text>{item.title}</Text>
        </View>
    );
}
```


## version-3

Version 3 introduces first‑class Web support and a new SectionList component, plus several API improvements. It’s currently labeled **beta** while we collect feedback.

## ✨ New in v3

### Web Support
- DOM‑native rendering (no React Native dependency required)
- Same virtualization core as React Native
- Web examples and docs

### SectionList Component
- `@legendapp/list/section-list` with a React Native‑compatible API
- `scrollToLocation` support
- Sticky section headers powered by `stickyHeaderIndices`

### Always Render
- `alwaysRender` keeps selected items mounted outside the virtualization window

### Better Scroll & Metrics APIs
- `initialScrollAtEnd` for chat and feeds
- `onMetricsChange` for header/footer size changes
- `getState()` now exposes listeners, element access, and scroll velocity

## 🔄 Breaking changes from v2

1) **`maintainVisibleContentPosition` behavior**
   - v2 default: always anchors during data changes
   - v3 default: only stabilizes during scroll/layout changes
   - To restore v2 behavior: `maintainVisibleContentPosition={{ data: true }}` or simply `true`

2) **Size callbacks argument order**
   - `getEstimatedItemSize` is now `(item, index, type)`
   - `getFixedItemSize` is now `(item, index, type)`

3) **Sticky headers prop rename**
   - `stickyIndices` → `stickyHeaderIndices` (deprecated alias kept for now)

## Migration checklist

- Update size callback signatures to `(item, index, type)`
- Replace `stickyIndices` with `stickyHeaderIndices`
- If you relied on data‑change anchoring, set `maintainVisibleContentPosition={{ data: true }}`
- (Optional) Consider `alwaysRender` for pinned items

## Install

```npm
npm install @legendapp/list
```

