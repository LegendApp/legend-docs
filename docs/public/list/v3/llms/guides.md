Practical recipes for common Legend List use cases.

## Chat Interfaces

Use this when your messages should start at the bottom without using `inverted`.

```ts
alignItemsAtEnd?: boolean;
maintainScrollAtEnd?: boolean;
maintainScrollAtEndThreshold?: number;
```

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

Pitfalls:
- Avoid `inverted`; it can cause animation and scroll edge cases.
- Tune `maintainScrollAtEndThreshold` for your UX.

## Infinite Scrolling

Use `onEndReached` for standard feeds and `onStartReached` for prepending older items.

```ts
onStartReached?: ((info: { distanceFromStart: number }) => void) | null | undefined;
onStartReachedThreshold?: number;
onEndReached?: ((info: { distanceFromEnd: number }) => void) | null | undefined;
onEndReachedThreshold?: number;
```

```tsx
<LegendList
  data={data}
  renderItem={({ item }) => <MessageItem item={item} />}
  keyExtractor={(item) => item.id}
  onEndReached={loadMoreAtEnd}
  onStartReached={loadMoreAtStart}
  onEndReachedThreshold={0.5}
  onStartReachedThreshold={0.5}
  maintainVisibleContentPosition={{ data: true }}
  recycleItems
/>
```

Pitfalls:
- Guard against duplicate loads (`loading` state or request dedupe).
- For prepend flows, keep `maintainVisibleContentPosition={{ data: true }}`.

## Always Render

Use `alwaysRender` to keep specific rows mounted outside the virtualized window.

```tsx
<LegendList
  data={data}
  keyExtractor={(item) => item.id}
  estimatedItemSize={48}
  alwaysRender={{ top: 2, bottom: 2 }}
  renderItem={({ item, index }) => (
    <Row label={item.title} pinned={index < 2 || index >= data.length - 2} />
  )}
/>
```

`alwaysRender` accepts:
- `top` / `bottom`: keep first/last N items mounted
- `indices`: keep explicit indices mounted
- `keys`: keep specific keys mounted (requires `keyExtractor`)

## Maintain Visible Content Position

Use this when data or size changes above the viewport should not move what the user is reading.

```ts
maintainVisibleContentPosition?:
  | boolean
  | {
      data?: boolean;
      size?: boolean;
      shouldRestorePosition?: (item: ItemT, index: number, data: ItemT[]) => boolean;
    };
```

Defaults:
- `size: true` stabilizes scroll during size/layout changes
- `data: false` does not anchor on data changes unless enabled

Common setup for prepend-heavy feeds:

```tsx
<LegendList
  data={messages}
  maintainVisibleContentPosition={{ data: true, size: true }}
  onStartReached={loadOlderMessages}
/>
```

## SectionList patterns

For grouped data with headers/footers per section, use `SectionList`.

```tsx
import { SectionList } from "@legendapp/list/section-list";

<SectionList
  sections={sections}
  keyExtractor={(item) => item.id}
  renderSectionHeader={({ section }) => <Header title={section.title} />}
  renderItem={({ item }) => <Row item={item} />}
  stickySectionHeadersEnabled
  estimatedItemSize={48}
/>
```

For full prop and method details (including `scrollToLocation`), see [API Reference](../api#sectionlist).
