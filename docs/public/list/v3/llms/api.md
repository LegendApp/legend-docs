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
import {
  KeyboardAwareLegendList,
  useKeyboardChatComposerInset,
  useKeyboardScrollToEnd,
} from "@legendapp/list/keyboard";
import { KeyboardAvoidingLegendList } from "@legendapp/list/keyboard-legacy";
```

See [Keyboard & Animated](../react-native/keyboard-and-animated) for Reanimated-only props such as `sharedValues` and `itemLayoutAnimation`.

## Required Props
___
LegendList supports two render modes:

- Data mode: `data` + `renderItem`
- Children mode: `children`

When using one mode, the other mode's props should not be provided.

### children

```ts
children: ReactNode;
```

Render list items directly as children in children mode (instead of `data`/`renderItem`).

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

`renderItem` is called as a render callback. If your row uses hooks, return a component from the callback rather than passing the component function directly:

```tsx
const Row = ({ item }: { item: ItemT }) => {
  const value = useRowValue(item.id);
  return <Text>{value}</Text>;
};

<LegendList
  data={items}
  renderItem={({ item }) => <Row item={item} />}
/>
```

See [React Native Docs](https://reactnative.dev/docs/flatlist#renderItem).

<br />

## Recommended Props
___
### keyExtractor

```ts
keyExtractor?: (item: ItemT, index: number) => string;
```

Strongly recommended. The `keyExtractor` prop lets Legend List save item layouts by key, so when the `data` array changes it can reuse previous layout information and update only the changed items.

Return a stable unique key for each logical item. Reusing a key for different items, or using the item index in a list that can reorder or prepend items, will attach cached measurements and recycled state to the wrong row. Index keys are only reasonable for static or append-only lists where earlier item positions never change. See [Use key extractor](../performance#use-keyextractor).

If LegendList detects duplicate keys, it will log a warning.

### recycleItems (React Native)

```ts
recycleItems?: boolean; // default: false
```

This will reuse the component rendered by your `renderItem` function. This can be a big performance improvement, but if your list items have internal state there is potential for state to carry over when a component is recycled for a different item. See [Performance](../performance#recycling-list-items).

This is mostly useful for React Native to reuse native views - it has a neglibible effect on web.

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

### anchoredEndSpace

```ts
anchoredEndSpace?: {
  anchorIndex: number;
  anchorOffset?: number;
  anchorMaxSize?: number;
  onReady?: (info: {
    anchorIndex: number | undefined;
    anchorKey: string | undefined;
    size: number;
  }) => void;
  onSizeChanged?: (size: number) => void;
};
```

Keeps a chosen item visually anchored to the start by adding trailing space when the content below that item underflows.

- `anchorIndex`: required index of the item to keep anchored.
- `anchorOffset`: subtracts pixels from the computed blank space. Useful when the anchored row should stop short of the edge.
- `anchorMaxSize`: caps the amount of inserted blank space.
- `onReady`: called when LegendList has authoritative anchored-tail sizing for the current anchor. Use this when an integration needs to wait until the inserted tail space is known before running follow-up scroll work.
- `onSizeChanged`: called whenever the inserted blank space changes.

Platform notes:

- Web: available on `LegendList` from `@legendapp/list/react`.
- React Native: use `KeyboardAwareLegendList` from `@legendapp/list/keyboard` for this lower-level integration.

### columnWrapperStyle

```ts
columnWrapperStyle?: StyleProp<ViewStyle>;
```

Style applied to each column's wrapper view.

### contentContainerClassName

```ts
contentContainerClassName?: string;
```

Web only. Adds a `className` to the inner content div inside the scroll container.
Use this when your app styles the content container with CSS classes instead of inline styles.

<Callout title="Gap classes">
`gap-*`, `gap-x-*`, and `gap-y-*` classes in `contentContainerClassName` are not used for LegendList item spacing because items are positioned virtually. Use `contentContainerStyle={{ gap: 16, padding: 16 }}` or `columnWrapperStyle` instead.
</Callout>

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

### contentInsetEndAdjustment

```ts
contentInsetEndAdjustment?: number;
```

Web only on `LegendList` from `@legendapp/list/react`. Adjusts the effective end inset without replacing the base `contentInset`.

LegendList also renders the adjustment as real trailing DOM space, so browser scroll range, `scrollToEnd`, and end-pinned behavior stay aligned when a floating composer or overlay grows and shrinks.

For React Native keyboard-aware lists, pass a Reanimated shared value to `KeyboardAwareLegendList` instead:

```tsx
const { contentInsetEndAdjustment, onComposerLayout } =
  useKeyboardChatComposerInset(listRef, composerRef);

<KeyboardAwareLegendList
  contentInsetEndAdjustment={contentInsetEndAdjustment}
  ref={listRef}
  {...props}
/>
```

Use this for floating composers, input bars, or other UI that visually covers the end of the list while remaining outside normal list content flow.

### dataVersion

```ts
dataVersion?: Key;
```

Version token that forces the list to treat data as updated even when the array reference is stable. Increment this when mutating `data` in place.

### drawDistance

```ts
drawDistance?: number;
```

The `drawDistance` (defaults to `250`) is the buffer size in pixels above and below the viewport that will be rendered in advance. See [Performance](../performance#set-drawdistance-prop) for more.

### estimatedHeaderSize

```ts
estimatedHeaderSize?: number;
```

Estimated height of `ListHeaderComponent` before it is measured.

Use this when the expected header height is known before layout and the header appears above the first visible items. It lets LegendList allocate only the rows that are actually visible below the header on the initial frame, instead of rendering a full viewport of rows that may be hidden behind the header.

The measured header size replaces this estimate after layout.

### estimatedItemSize

```ts
estimatedItemSize?: number;
```

Optional first-render allocation hint. Legend List works well without this prop, and after rows are measured it uses measured item sizes and averages instead.

In v3, `estimatedItemSize` mostly affects how many item containers are allocated before measurement. The default estimate is `100px`, so you usually do not need to set it unless your rows are significantly larger or smaller than that, or you need better initial offsets for a far `initialScrollIndex` / `snapToIndices` target.

### estimatedListSize

```ts
estimatedListSize?: { height: number; width: number };
```

Estimated size of the list viewport used as a first-render hint before actual layout is measured.

### extraData

```ts
extraData?: any;
```

Avoid this when possible. `extraData` is a whole-list invalidation escape hatch, not the recommended way to pass changing item state.

Changing `extraData` causes Legend List to re-render all items because the value is passed through every `renderItem` call. That can be expensive for large lists or frequently changing state.

Prefer external state that each item subscribes to directly, for example React context, a state library selector, or another item-scoped subscription. Use `extraData` only when you intentionally need every rendered item to re-evaluate from the same changed value.

See [React Native Docs](https://reactnative.dev/docs/flatlist#extraData).

### experimental_adaptiveRender

```ts
type AdaptiveRender = "normal" | "light";

experimental_adaptiveRender?: {
  initialMode?: AdaptiveRender; // default: "normal"
  enterVelocity?: number; // default: 3 native, 6 web
  exitVelocity?: number; // default: 1 native, 3 web
  exitDelay?: number; // default: 250
  onChange?: (mode: AdaptiveRender) => void;
};
```

Enables an adaptive render signal for expensive item content. This is a performance optimization for lists whose rows do significant work while rendering, such as charts, media, syntax highlighting, rich previews, embeds, or expensive formatting.

When scroll velocity crosses `enterVelocity`, LegendList switches the signal to `"light"` so rows can render a cheaper version while the list is moving quickly. After velocity drops below `exitVelocity` for `exitDelay` milliseconds, it returns to `"normal"`. This reduces JS/render work during fast scrolls and lets full content come back when the user slows down or stops.

Use `initialMode` when rows should start in `"light"` mode before the list is ready, for example when you prefer a very cheap first pass before expensive media or charts render.

Good uses for light mode include:

- Rendering unformatted text instead of expensive formatted text, markdown, or syntax highlighting.
- Rendering skeleton boxes instead of images, videos, charts, or rich previews.
- Skipping gesture detectors, menus, modal setup, or other interactive wrappers that are only needed when the row is being inspected.

There are two main ways to use adaptive rendering:

1. Inside rendered items, read the current mode with [useAdaptiveRender](#useadaptiverender) or subscribe to changes with [useAdaptiveRenderChange](#useadaptiverenderchange). This is the simplest option when each row can choose its own light/full render.
2. Use `experimental_adaptiveRender.onChange` to write the mode into global or external state, then let expensive child components subscribe to that state. This is useful when adaptive mode needs to affect components deeper in the row tree or components that are shared outside the direct list item boundary.

```tsx
<LegendList
  data={items}
  renderItem={({ item }) => <FeedRow item={item} />}
  experimental_adaptiveRender={{
    enterVelocity: 6,
    exitVelocity: 3,
    onChange: (mode) => adaptiveRenderStore.set(mode),
  }}
/>
```

Use adaptive rendering for the expensive part of a row, not as a replacement for basic row memoization or stable `renderItem` patterns. Simple text rows usually do not need it.

The light version should keep the same rendered size as the normal version. If switching modes changes an item's height or width, the list has to correct measured positions while scrolling, which can cause visible layout shifts.

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

Renders items along the horizontal axis instead of the vertical axis.

### initialScrollAtEnd

```ts
initialScrollAtEnd?: boolean; // default: false
```

When true, the list initializes scrolled to the last item. Overrides `initialScrollIndex` and `initialScrollOffset` when data is available.

This is designed for chat/feed screens and works with dynamic item measurement, async data arrival, and end-inset changes from floating composers. On iOS, LegendList waits for native initial-scroll confirmation before marking the initial scroll complete.

### initialScrollIndex

```ts
initialScrollIndex?: number | { index: number; viewOffset?: number; viewPosition?: number };
```

Start scrolled with this item at the top (or at the provided `viewPosition`). If item sizes are dynamic, the list will adjust after measurement using the default scroll‑stabilization behavior.

For large lists, LegendList can seed the initial render near the target index instead of scanning from the beginning when it has enough sizing information. If data arrives after mount, the initial target is re-armed and applied when items are available.

### initialScrollOffset

```ts
initialScrollOffset?: number;
```

Start scrolled to this offset.

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
  animated?: boolean;
  on?: {
    dataChange?: boolean;
    footerLayout?: boolean;
    itemLayout?: boolean;
    layout?: boolean;
  };
};
```

If enabled, LegendList keeps the view pinned to end when you are near the bottom.

- `true`: enables end-maintenance for layout, item-layout, and data updates.
- `animated`: whether the automatic scroll-to-end should animate. Defaults to `false`.
- If `on` is omitted, the object form enables all triggers.
- If `on` is provided, only the keys set to `true` are enabled.
- `footerLayout`: opt into footer size changes when using an explicit `on` config. This is useful for chat typing indicators and dynamic footers that should keep an end-pinned list at the bottom.

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

### onFirstVisibleItemChanged

```ts
onFirstVisibleItemChanged?: (info: {
  index: number;
  item: ItemT;
  key: string;
}) => void;
```

Called when the first visible item changes. This is emitted from LegendList's core range calculation and is cheaper than full viewability tracking when you only need to follow the item at the top of the viewport, such as updating a section label, mini-map, or current date marker.

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

Called whenever an item's rendered size changes. This can be used to inspect real row sizes, especially if you are deciding whether `estimatedItemSize` is worth setting for unusual item sizes.

### onLoad

```ts
onLoad?: (info: { elapsedTimeInMs: number }) => void;
```

Called after the list is ready to render. Useful for measuring first render readiness.

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

### onViewableItemsChanged

```ts
onViewableItemsChanged?: OnViewableItemsChanged | undefined;
```

Called when the viewability of rows changes, as defined by the `viewabilityConfig` prop.

See [React Native Docs](https://reactnative.dev/docs/flatlist#onviewableitemschanged).


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

### rtl

```ts
rtl?: boolean;
```

Forces right-to-left layout behavior for this list instance. When omitted, LegendList uses the platform/global RTL setting, such as React Native's `I18nManager.isRTL`.

This is mainly useful for horizontal lists when you need one list to override the app-level RTL direction.

### snapToIndices

```ts
snapToIndices?: number[];
```

An array of item indices that become snap points. LegendList converts those indices into scroll offsets and passes them to the underlying scroll container as snap offsets.

On web, snap targets can point to items outside the currently mounted DOM window. LegendList computes the offsets from list measurements and estimates, so sparse snap targets can still work with virtualization.

Use `getFixedItemSize` when snap targets have exact fixed sizes. For dynamic rows, `estimatedItemSize` is only an initial offset hint until rows are measured; it is usually worth setting only when rows differ significantly from the default `100px`.

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

### stickyHeaderIndices

```ts
stickyHeaderIndices?: number[];
```

An array of indices for items that should stick to the top of the list while scrolling. Sticky headers remain visible at the top of the viewport as you scroll past them.
Not supported with `horizontal={true}`.

### style

```ts
style?: StyleProp<ViewStyle>;
```

Style applied to the underlying ScrollView. On web this maps to the scroll container’s CSS style.

### useWindowScroll

```ts
useWindowScroll?: boolean; // default: false
```

Web only. When true, LegendList listens to window/body scrolling instead of rendering its own scrollable container.

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

<br />

## SectionList

Legend List ships a SectionList-compatible component built on the same virtualization core.

```tsx
import { SectionList } from "@legendapp/list/section-list";
```

### Quick example

```tsx
import { Text } from "react-native";
import { SectionList } from "@legendapp/list/section-list";

const sections = [
  { title: "A", data: ["Apple", "Avocado"] },
  { title: "B", data: ["Banana", "Blueberry"] },
];

const Header = ({ title }: { title: string }) => <Text>{title}</Text>;
const Row = ({ label }: { label: string }) => <Text>{label}</Text>;

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
- Accepts shared LegendList performance props like `recycleItems`, `maintainScrollAtEnd`, `drawDistance`, and `experimental_adaptiveRender`.
- Manages `stickyHeaderIndices` internally.

Common SectionList-specific props:

```ts
type SectionListProps<ItemT, SectionT> = {
  ItemSeparatorComponent?: ComponentType<SectionListSeparatorProps<ItemT, SectionT>> | null;
  SectionSeparatorComponent?: ComponentType<SectionListSeparatorProps<ItemT, SectionT>> | ReactElement | null;
  getFixedItemSize?: (info:
    | (SectionListRenderItemInfo<ItemT, SectionT> & { type: "item" })
    | { section: SectionListData<ItemT, SectionT>; type: "header" }
    | { section: SectionListData<ItemT, SectionT>; type: "footer" }
    | (SectionListSeparatorProps<ItemT, SectionT> & { type: "item-separator" })
    | (SectionListSeparatorProps<ItemT, SectionT> & { type: "section-separator" })
  ) => number | undefined;
  keyExtractor?: (item: ItemT, index: number) => string;
  onViewableItemsChanged?: SectionListOnViewableItemsChanged<ItemT, SectionT>;
  renderItem?: (info: SectionListRenderItemInfo<ItemT, SectionT>) => ReactElement | null;
  renderSectionFooter?: (info: { section: SectionListData<ItemT, SectionT> }) => ReactElement | null;
  renderSectionHeader?: (info: { section: SectionListData<ItemT, SectionT> }) => ReactElement | null;
  sections: ReadonlyArray<SectionListData<ItemT, SectionT>>;
  stickySectionHeadersEnabled?: boolean;
};
```

Notes:

- `stickySectionHeadersEnabled` defaults to the React Native platform behavior. It is enabled by default on iOS and disabled by default on other platforms.
- `getFixedItemSize` can return exact sizes for section items, headers, footers, item separators, and section separators. Return `undefined` for row types that should stay dynamically measured.
- `onViewableItemsChanged` receives item tokens mapped back to `{ item, index, key, isViewable, section }`, so callbacks do not need to understand the internal flattened section rows.
- Section and item separators receive React Native-style separator helpers (`highlight`, `unhighlight`, `updateProps`) plus section/item context.

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

### getState

```ts
getState(): LegendListState;
```

Returns a live snapshot API for advanced integrations. See [getState()](#getstate-details) for the full type, fields, listener channels, caveats, and examples.

### reportContentInset

```ts
reportContentInset(inset?: { top?: number; left?: number; bottom?: number; right?: number } | null): void;
```

Reports an externally measured content inset (merged with props/native insets). Pass `null`/`undefined` to clear.

### scrollIndexIntoView

Scrolls the index into view. If the index is above the viewable range it will be scrolled to the top of the screen, and if it's below the viewable range it will be scrolled to the bottom of the screen.

```ts
scrollIndexIntoView(params: {
  animated?: boolean | undefined;
  index: number;
}): Promise<void>
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
}): Promise<void>;
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

### scrollToEnd

```ts
scrollToEnd(params?: {
  animated?: boolean,
  viewOffset?: number,
}): Promise<void>;
```

Scrolls to the end of the list.

Valid parameters:

- *animated* (boolean) - Whether the list should do an animation while scrolling. Defaults to true.

### scrollToIndex

```ts
scrollToIndex(params: {
  index: number;
  animated?: boolean;
  viewOffset?: number;
  viewPosition?: number;
}): Promise<void>;
```

Scrolls to the item at the specified index. For the most accurate initial offset, use [getFixedItemSize](#getfixeditemsize) for truly fixed-size rows. Dynamic rows stabilize through measurement; `estimatedItemSize` is only an initial hint and is most useful when rows differ significantly from the default `100px`.
Returns a promise that resolves when the imperative scroll finishes (or immediately if no scroll was needed).

### scrollToItem

```ts
scrollToItem(params: {
  animated?: boolean,
  item: Item,
  viewOffset?: number;
  viewPosition?: number;
}): Promise<void>;
```

Requires linear scan through data - use [scrollToIndex](#scrolltoindex) instead if possible. Provided for compatibility with FlatList only.

Valid parameters:

- *animated* (boolean) - Whether the list should do an animation while scrolling. Defaults to true.
- *item* (object) - The item to scroll to. Required.

### scrollToOffset

```ts
scrollToOffset(params: {
  offset: number;
  animated?: boolean;
}): Promise<void>;
```

Scroll to a specific content pixel offset in the list.

Valid parameters:

- *offset* (number) - The offset to scroll to. In case of horizontal being true, the offset is the x-value, in any other case the offset is the y-value. Required.
- *animated* (boolean) - Whether the list should do an animation while scrolling. Defaults to true.

### setItemSize

```ts
setItemSize(itemKey: string, size: { height: number; width: number }): void;
```

Updates a known item's measured size directly and recalculates positions as needed. Use this when an item's content changes outside normal layout measurement, for example when media dimensions arrive from cache or a custom native surface reports its final size through a separate channel.

`itemKey` is the value returned by `keyExtractor`, so stable keys are required.

### setScrollProcessingEnabled

```ts
setScrollProcessingEnabled(enabled: boolean): void;
```

Enables or disables scroll processing. Useful when you need to temporarily opt out of list virtualization behavior.

### setVisibleContentAnchorOffset

```ts
setVisibleContentAnchorOffset(value: number | ((current: number) => number)): void;
```

Adjusts the internal anchor offset used by `maintainVisibleContentPosition`. Useful for advanced scroll anchoring behavior.

<br />

## Hooks

<Callout>
Hooks are exported from both `@legendapp/list/react-native` and `@legendapp/list/react`.
</Callout>

### useAdaptiveRender

```ts
useAdaptiveRender: () => "normal" | "light";
```

Returns the current adaptive render mode for the item being rendered. Enable the signal with [experimental_adaptiveRender](#experimental_adaptiverender), then use this hook inside rows to switch expensive content to a lighter render while the list is moving quickly.

```tsx
import { useAdaptiveRender } from "@legendapp/list/react-native";

function FeedRow({ item }) {
  const mode = useAdaptiveRender();

  return (
    <RowShell item={item}>
      {mode === "light" ? <CompactPreview item={item} /> : <RichPreview item={item} />}
    </RowShell>
  );
}
```

### useAdaptiveRenderChange

```ts
useAdaptiveRenderChange: (callback: (mode: "normal" | "light") => void) => void;
```

Runs `callback` whenever the adaptive render mode changes for the current item. Use this when switching modes should drive item-local imperative work, such as pausing a chart, video, or expensive animation while fast scrolling is active.

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

function ExpensiveComponent() {
    return <Text>Expensive content</Text>;
}

function PlaceholderComponent() {
    return <Text>Placeholder</Text>;
}

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

<a id="getstate-details"></a>

## getState()

`getState()` is a function on `LegendListRef`, accessed as `ref.current?.getState()`. See its entry in [Ref Methods](#ref-method-getstate).

This is likely not necessary in most apps, but can power advanced functionality and customization. It is used by [KeyboardAwareLegendList](../react-native/keyboard-and-animated#keyboardawarelegendlist) for example.

### LegendListState type

```ts
type LegendListState = {
  activeStickyIndex: number;
  contentLength: number;
  data: readonly any[];
  elementAtIndex: (index: number) => any;
  end: number;
  endBuffered: number;
  getAverageItemSizes: () => Record<string, LegendListAverageItemSize>;
  isAtEnd: boolean;
  isAtStart: boolean;
  isEndReached: boolean;
  isNearEnd: boolean;
  isNearStart: boolean;
  isStartReached: boolean;
  isWithinMaintainScrollAtEndThreshold: boolean;
  listen: <T extends LegendListListenerType>(
    listenerType: T,
    callback: (value: ListenerTypeValueMap[T]) => void
  ) => () => void;
  listenToPosition: (key: string, callback: (value: number) => void) => () => void;
  positionAtIndex: (index: number) => number;
  positionByKey: (key: string) => number | undefined;
  scroll: number;
  scrollLength: number;
  scrollVelocity: number;
  sizeAtIndex: (index: number) => number;
  sizes: Map<string, number>;
  start: number;
  startBuffered: number;
};

type LegendListAverageItemSize = {
  average: number;
  count: number;
};
```

### Fields and Methods

- `activeStickyIndex`: currently active sticky item index (`-1` when none)
- `contentLength`: content size of the list including header/footer/insets
- `data`: current data array reference used by the list
- `elementAtIndex(index)`: rendered native element for an index (if currently mapped to a container)
- `getAverageItemSizes()`: measured average item sizes grouped by item type. Use this to inspect real sizing data when deciding whether `estimatedItemSize` is worth setting for unusually sized rows.
- `isAtStart` / `isAtEnd`: threshold-based booleans for edge-of-list state
- `isNearStart` / `isNearEnd`: proximity booleans based on the configured start/end thresholds
- `isStartReached` / `isEndReached`: whether the one-shot threshold callbacks are currently latched
- `isWithinMaintainScrollAtEndThreshold`: whether the current scroll position is close enough to the tail for `maintainScrollAtEnd` to apply
- `listen(...)`: subscribe to selected internal state channels
- `listenToPosition(key, ...)`: subscribe to position updates for one item key
- `positionAtIndex(index)`: known position for an index
- `positionByKey(key)`: known position for an item key (if available)
- `scroll`: current scroll offset
- `scrollLength`: viewport length along scroll axis
- `scrollVelocity`: current estimated scroll velocity
- `sizeAtIndex(index)`: known measured size for an index
- `sizes`: key-to-size map of known measured item sizes
- `start` / `end`: visible range bounds without buffer
- `startBuffered` / `endBuffered`: virtualized range bounds including draw buffer

### Listen Channels

`listen` supports these channel names:

- `activeStickyIndex` (`number`)
- `anchoredEndSpaceSize` (`number`)
- `footerSize` (`number`)
- `headerSize` (`number`)
- `isAtEnd` (`boolean`)
- `isAtStart` (`boolean`)
- `isNearEnd` (`boolean`)
- `isNearStart` (`boolean`)
- `isWithinMaintainScrollAtEndThreshold` (`boolean`)
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
- `positionByKey` can return `undefined` if a key is unknown or not measured yet.
- `elementAtIndex` can return `null`/`undefined` when the item is not currently rendered.
- `sizes` is a live `Map` reference that updates as list state changes.
- `getAverageItemSizes()` only reports types that have measured items. Items without a `getItemType` value are grouped under `default`.

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

```tsx
import { useEffect, useRef } from "react";
import { LegendList, type LegendListRef } from "@legendapp/list/react-native";

function AverageSizeExample() {
  const ref = useRef<LegendListRef>(null);

  useEffect(() => {
    const state = ref.current?.getState();
    if (!state) return;

    const unsubscribe = state.listen("lastPositionUpdate", () => {
      console.log("average item sizes", state.getAverageItemSizes());
    });

    return unsubscribe;
  }, []);

  return <LegendList ref={ref} data={data} renderItem={renderItem} />;
}
```

<br />
