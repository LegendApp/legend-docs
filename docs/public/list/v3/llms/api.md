This page documents LegendList APIs for both React Native and React (Web).

<Callout>
Props apply to both React Native and Web unless otherwise noted. Platform-specific notes are called out inline.
</Callout>

## Imports and entrypoints

```ts
// Choose one platform-specific LegendList import
import { LegendList } from "@legendapp/list/react-native";
import { LegendList } from "@legendapp/list/react";

// Optional entrypoints
import { SectionList } from "@legendapp/list/section-list";
import { AnimatedLegendList } from "@legendapp/list/animated";
import { AnimatedLegendList as ReanimatedLegendList } from "@legendapp/list/reanimated";
import { KeyboardAvoidingLegendList } from "@legendapp/list/keyboard";
```

<Callout>
The root import (`@legendapp/list`) is still functional (they all share the same JavaScript code), but deprecated for strict typing. Prefer `@legendapp/list/react-native` and `@legendapp/list/react`.
</Callout>

## Required Props
___
LegendList supports two render modes:

- Data mode: `data` + `renderItem`
- Children mode: `children`

When using one mode, the other mode's props should not be provided.

### data

```ts
data: ItemT[];
```

An array of the items to render in data mode. This can also be an array of keys if you want to get the item by key in [renderItem](#renderitem).

### renderItem

```ts
renderItem: (props: { item: ItemT; index: number; extraData: any; type?: string; data: readonly ItemT[] }) => ReactNode;
```

Takes an item from data and renders it into the list in data mode. The `type` parameter is available when using `getItemType`.

See [React Native Docs](https://reactnative.dev/docs/flatlist#renderItem).

### children

```ts
children: ReactNode;
```

Render list items directly as children in children mode (instead of `data`/`renderItem`).

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

Aligns to the end of the screen. If there's only a few items, Legend List will add padding to the top to align them to the bottom. See [Chat interfaces](../guides#chat-interfaces) for more.

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

### estimatedListSize

```ts
estimatedListSize?: { height: number; width: number };
```

Estimated size of the list viewport used as a first-render hint before actual layout is measured.

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

An estimated size for each item which is used to estimate the list layout before items actually render.
If omitted, LegendList uses measured averages (and initial `estimatedItemSize`). To log suggestions in development, enable [`suggestEstimatedItemSize`](#suggestestimateditemsize).

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

### itemsAreEqual

```ts
itemsAreEqual?: (itemPrevious: ItemT, item: ItemT, index: number, data: readonly ItemT[]) => boolean;
```

Optional equality comparator used during data changes to preserve known item sizes and reduce relayout work when items are logically unchanged.

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

```ts
ListHeaderComponentStyle?: StyleProp<ViewStyle> | undefined;
```

Styling for internal View for `ListHeaderComponent`.

See [React Native Docs](https://reactnative.dev/docs/flatlist#listheadercomponentstyle).


### maintainScrollAtEnd

```ts
maintainScrollAtEnd?: boolean | {
  onLayout?: boolean;
  onItemLayout?: boolean;
  onDataChange?: boolean;
};
```

If enabled, LegendList keeps the view pinned to end when you are near the bottom.

- `true`: enables end-maintenance for layout, item-layout, and data updates.
- object form: choose which update types should keep end-position pinned.

See [Chat interfaces](../guides#chat-interfaces) for more.

### maintainScrollAtEndThreshold

```ts
maintainScrollAtEndThreshold?: number;
```

This defines what percent of the screen counts as the bottom. Defaults to `0.1`.

See [Chat interfaces](../guides#chat-interfaces) for more.

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

### onLoad

```ts
onLoad?: (info: { elapsedTimeInMs: number }) => void;
```

Called after the list is ready to render. Useful for measuring first render readiness.

### onRefresh

```ts
onRefresh?: () => void;
```

React Native only. Called whenever a user pulls down to refresh. See [React Native Docs](https://reactnative.dev/docs/flatlist#onRefresh).

### onScroll

```ts
onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
```

Called on scroll events with platform-specific scroll data.

### onStartReached

```ts
onStartReached?: ((info: { distanceFromStart: number }) => void) | null | undefined;
```

A callback that's called only once when scroll is within `onStartReachedThreshold` of the top of the list. It resets when scroll goes above the threshold and then will be called again when scrolling back into the threshold.

### onStartReachedThreshold

```ts
onStartReachedThreshold?: number | null | undefined;
```

The distance from the start as a percentage that the scroll should be from the start to trigger `onStartReached`. It is multiplied by screen size, so a value of 0.5 will trigger `onStartReached` when scrolling to half a screen from the start.

### onStickyHeaderChange

```ts
onStickyHeaderChange?: (info: { index: number; item: any }) => void;
```

Called when the active sticky header changes.

### overrideItemLayout

```ts
overrideItemLayout?: (
  layout: { span?: number },
  item: ItemT,
  index: number,
  maxColumns: number,
  extraData?: any
) => void;
```

Customize multi-column item layout (for example, setting `span`) before positions are computed.

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

### refScrollView

```ts
refScrollView?: React.Ref<any>;
```

Ref to the underlying scroll container instance.

### renderScrollComponent

```ts
renderScrollComponent?: (props: ScrollViewProps) => ReactElement | null
```

Render a custom scroll component. On React Native this is typically a `ScrollView`; on web this is the underlying DOM scroll element wrapper.
On React Native, when using `stickyHeaderIndices`, provide an Animated-capable scroll component.

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

### stickyHeaderConfig

```ts
stickyHeaderConfig?: {
  offset?: number;
  backdropComponent?: React.ComponentType<any> | React.ReactElement | null | undefined;
};
```

Configures sticky header behavior:

- `offset`: sticky top offset (for fixed toolbars/navbars)
- `backdropComponent`: optional backdrop rendered behind sticky header

### style

```ts
style?: StyleProp<ViewStyle>;
```

Style applied to the underlying ScrollView. On web this maps to the scroll container’s CSS style.

### suggestEstimatedItemSize

```ts
suggestEstimatedItemSize?: boolean;
```

When enabled in development, LegendList logs suggested `estimatedItemSize` values based on measured items.

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

## SectionList

Legend List ships a SectionList-compatible component built on the same virtualization core.

```tsx
import { SectionList } from "@legendapp/list/section-list";
```

### Quick example

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
      renderSectionHeader={({ section }) => <Header title={section.title} />}
      renderItem={({ item }) => <Row label={item} />}
      stickySectionHeadersEnabled
      estimatedItemSize={48}
    />
  );
}
```

### Behavior and API

- Mirrors React Native `SectionList` props: `sections`, `renderSectionHeader`, `renderSectionFooter`, separators, `stickySectionHeadersEnabled`, and `scrollToLocation`.
- Accepts shared LegendList performance props like `recycleItems`, `maintainScrollAtEnd`, and `drawDistance`.
- Manages `stickyHeaderIndices` internally.

### scrollToLocation

```ts
ref.current?.scrollToLocation({
  sectionIndex: 2,
  itemIndex: 10,
  viewPosition: 0,
  viewOffset: 12,
  animated: true,
});
```

### Limitations

- `horizontal` disables sticky section headers.
- `numColumns` and `columnWrapperStyle` are not supported (SectionList is always one column).
- `stickyHeaderIndices` is managed internally.

<br />

## Ref Methods
___

<a id="ref-method-getstate"></a>

### getState

```ts
getState(): LegendListState;
```

Returns a live snapshot API for advanced integrations. See [getState()](#getstate-details) for the full type, fields, listener channels, caveats, and examples.

### clearCaches

```ts
clearCaches(options?: { mode?: "sizes" | "full" }): void;
```

Clears internal virtualization caches.

- `sizes` (default): clears size/average caches and recalculates item positions.
- `full`: also clears key/index/position caches.

Useful if you know cached measurements are stale after major data/layout changes.

### flashScrollIndicators

```ts
flashScrollIndicators(): void;
```

Asks the underlying scroll component to briefly show its scroll indicators.

### getNativeScrollRef

```ts
getNativeScrollRef(): any;
```

Returns the underlying scroll instance (platform-specific type).

### getScrollableNode

```ts
getScrollableNode(): any;
```

Returns the underlying native/DOM node used for scrolling.

### getScrollResponder

```ts
getScrollResponder(): any;
```

Returns the platform scroll responder object for advanced integrations.

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
import { LegendList } from "@legendapp/list/react-native";

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
import { LegendList } from "@legendapp/list/react-native";

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

<Callout>
Hooks are exported from both `@legendapp/list/react-native` and `@legendapp/list/react`.
</Callout>

### useRecyclingState

```ts
interface LegendListRecyclingState<T> {
    item: T;
    prevItem: T | undefined;
    index: number;
    prevIndex: number | undefined;
}
useRecyclingState: <T>(
  updateState: ((info: LegendListRecyclingState<T>) => T) | T
) => [T, Dispatch<SetStateAction<T>>];
```

`useRecyclingState` automatically resets the state when an item is recycled into a new item.

```tsx
import { useRecyclingState } from "@legendapp/list/react-native"
export function ItemComponent({ item }) {
    // Like useState but it resets when the item is recycled
    const [isExpanded, setIsExpanded] = useRecyclingState(() => false);

    // ...
}
```

### useIsLastItem

```ts
useIsLastItem: () => boolean;
```

Returns `true` when the current rendered item is one of the list's last items.
Useful for conditional spacing, CTA rows, or end-of-list UI logic.

### useListScrollSize

```ts
useListScrollSize: () => { width: number; height: number };
```

Returns the current scroll viewport size for the parent list.
Useful when item rendering depends on viewport dimensions.

### useRecyclingEffect

```ts
interface LegendListRecyclingState<T> {
    item: T;
    prevItem: T | undefined;
    index: number;
    prevIndex: number | undefined;
}
useRecyclingEffect: (effect: (info: LegendListRecyclingState<unknown>) => void | (() => void)) => void;
```

`useRecyclingEffect` can be used to reset any side effects when an item gets recycled.

```tsx
import { useRef } from "react";
import { useRecyclingEffect } from "@legendapp/list/react-native"

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
useViewability: (callback: (viewToken: ViewToken) => void, configId?: string) => void;
```

A hook that provides callbacks when an item's viewability changes. This hook registers a callback that will be invoked whenever the item's visibility status changes, providing detailed information about the item through the ViewToken interface. It is similar to [onViewableItemsChanged](#onviewableitemschanged) but runs for only the rendering item. If you defined multiple viewability configs using [viewabilityConfigCallbackPairs](#viewabilityconfigcallbackpairs) then provide the id of the one you're interested in with `configId`.

```tsx
import { useState } from "react";
import { View, Text } from "react-native";
import { useViewability } from "@legendapp/list/react-native"

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
import { useViewabilityAmount } from "@legendapp/list/react-native"

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
useSyncLayout: () => () => void;
```

A hook for synchronizing layout operations. This is useful for advanced use cases where you need to coordinate layout updates with other components or operations.

```tsx
import { View, Text } from "react-native";
import { useSyncLayout } from "@legendapp/list/react-native"

export function ItemComponent({ item }) {
    const syncLayout = useSyncLayout();

    return (
        <View onLayout={syncLayout}>
            <Text>{item.title}</Text>
        </View>
    );
}
```

<a id="getstate-details"></a>

## getState()

`getState()` is a function on `LegendListRef`, accessed as `ref.current?.getState()`. See its entry in [Ref Methods](#ref-method-getstate).

This is likely not necessary in most apps, but can power advanced functionality and customization. It is used by [KeyboardAvoidingLegendList](../react-native/keyboard-and-animated#keyboardavoidinglegendlist) for example.

### LegendListState type

```ts
type LegendListState = {
  activeStickyIndex: number;
  contentLength: number;
  data: readonly any[];
  elementAtIndex: (index: number) => any;
  end: number;
  endBuffered: number;
  isAtEnd: boolean;
  isAtStart: boolean;
  listen: <T extends LegendListListenerType>(
    listenerType: T,
    callback: (value: ListenerTypeValueMap[T]) => void
  ) => () => void;
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
};
```

### Fields and Methods

- `activeStickyIndex`: currently active sticky item index (`-1` when none)
- `contentLength`: content size of the list including header/footer/insets
- `data`: current data array reference used by the list
- `elementAtIndex(index)`: rendered native element for an index (if currently mapped to a container)
- `start` / `end`: visible range bounds without buffer
- `startBuffered` / `endBuffered`: virtualized range bounds including draw buffer
- `isAtStart` / `isAtEnd`: threshold-based booleans for edge-of-list state
- `scroll`: current scroll offset
- `scrollLength`: viewport length along scroll axis
- `scrollVelocity`: current estimated scroll velocity
- `positions`: key-to-position map of known item offsets
- `sizes`: key-to-size map of known measured item sizes
- `positionAtIndex(index)`: known position for an index
- `sizeAtIndex(index)`: known measured size for an index
- `listen(...)`: subscribe to selected internal state channels
- `listenToPosition(key, ...)`: subscribe to position updates for one item key

### Listen Channels

`listen` supports these channel names:

- `activeStickyIndex` (`number`)
- `footerSize` (`number`)
- `headerSize` (`number`)
- `lastItemKeys` (`string[]`)
- `lastPositionUpdate` (`number`)
- `numContainers` (`number`)
- `numContainersPooled` (`number`)
- `otherAxisSize` (`number`)
- `readyToRender` (`boolean`)
- `snapToOffsets` (`number[]`)
- `totalSize` (`number`)

### Caveats

- `positionAtIndex` and `sizeAtIndex` assume the item has been measured; for unmeasured items values may be unavailable.
- `elementAtIndex` can return `null`/`undefined` when the item is not currently rendered.
- `positions` and `sizes` are live `Map` references that update as list state changes.

### Examples

```tsx
import { useEffect, useRef } from "react";
import { LegendList, type LegendListRef } from "@legendapp/list/react-native";

function StateSnapshotExample() {
  const ref = useRef<LegendListRef>(null);

  useEffect(() => {
    const state = ref.current?.getState();
    if (!state) return;
    console.log("scroll", state.scroll, "velocity", state.scrollVelocity);
    console.log("visible range", state.start, state.end);
  }, []);

  return <LegendList ref={ref} data={data} renderItem={renderItem} />;
}
```

```tsx
import { useEffect, useRef } from "react";
import { LegendList, type LegendListRef } from "@legendapp/list/react-native";

function ListenerExample() {
  const ref = useRef<LegendListRef>(null);

  useEffect(() => {
    const state = ref.current?.getState();
    if (!state) return;

    const unsubscribeTotal = state.listen("totalSize", (total) => {
      console.log("total size changed", total);
    });
    const unsubscribeSticky = state.listen("activeStickyIndex", (index) => {
      console.log("active sticky index", index);
    });

    return () => {
      unsubscribeTotal();
      unsubscribeSticky();
    };
  }, []);

  return <LegendList ref={ref} data={data} renderItem={renderItem} />;
}
```

```tsx
import { useEffect, useRef } from "react";
import { LegendList, type LegendListRef } from "@legendapp/list/react-native";

function PositionListenerExample() {
  const ref = useRef<LegendListRef>(null);

  useEffect(() => {
    const state = ref.current?.getState();
    if (!state) return;
    const unsubscribe = state.listenToPosition("message-42", (position) => {
      console.log("message-42 position", position);
    });
    return unsubscribe;
  }, []);

  return <LegendList ref={ref} data={data} keyExtractor={(item) => item.id} renderItem={renderItem} />;
}
```

<br />
