Legend List is very optimized by default, so it may already be working well without any configuration. But these are some common ways to improve your list behavior.

`estimatedItemSize` and `getFixedItemSize` are optional optimizations.
Legend List works without them. In v3, `estimatedItemSize` is mostly a small initial-mount hint that affects how many item containers are allocated before real measurements are available. If you omit it, Legend List uses a default initial estimate of `100px`, then switches to measured sizes and averages after rows render.

Do not spend time tuning `estimatedItemSize` unless your rows are significantly larger or smaller than `100px`, or you need better initial offsets for a far initial scroll or snap target.

### Use `keyExtractor` Prop

```ts
keyExtractor?: (item: T, index: number) => string;
```

The `keyExtractor` prop lets Legend List save item layouts by key, so when the `data` array changes it can reuse previous layout information and only update the changed items. Without `keyExtractor`, item sizes reset to their default whenever `data` changes.

Use a stable unique ID whenever possible. Index keys are only safe for static or append-only lists where earlier items never move; for prepends, sorting, filtering, or reordering, index keys can attach cached measurements and recycled state to the wrong row.

### Recycling List Items

```ts
recycleItems?: boolean // default: false
```

Legend List has an optional `recycleItems` prop which enables view recycling. This reuses the component rendered by your `renderItem` function, which can be a big performance optimization because the list does not need to destroy and create views while scrolling. It also means local item state can carry over when a component is recycled for a different item, so use the [recycling hooks](../api#userecyclingstate) for item-scoped state that must reset.

So there are some tradeoffs with recycling:

- 👍 If you have items with no state then recycling should be great
- 👎 If you have simple items with complex state then it may be more trouble than it's worth
- 👍 If you have heavy items with complex state then working around the state recycling may be worth it for the performance gains

### Avoid `extraData`

```ts
extraData?: any;
```

Avoid `extraData` when possible. It is a whole-list invalidation escape hatch, not the recommended way to pass changing item state.

Changing `extraData` causes Legend List to re-render all items because the value is passed through every `renderItem` call. This is convenient, but it pushes shared state changes through the whole list and can become expensive for large lists or frequently changing state.

Prefer external state that each item reads or subscribes to directly:

- Use React context when the state is naturally scoped that way.
- Use a state library selector so each item subscribes only to the values it needs.
- Avoid passing frequently changing shared state through the list just to reach `renderItem`.
- Use `extraData` only when you intentionally need every rendered item to re-evaluate from the same changed value.

### Estimate Item Sizes

```ts
estimatedItemSize?: number;
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

Use `estimatedItemSize` only if you want to lightly optimize the first render. It is not required for correctness.

Providing an item size estimate helps determine the initial number of containers to allocate, based on screen size / `estimatedItemSize`. `estimatedItemSize` is used only before measurements are available, then Legend List switches to using the average of actually rendered item sizes.

As a rule of thumb:

- Use `getFixedItemSize` when item sizes are truly fixed.
- Use `estimatedItemSize` when dynamic items are significantly different from the default `100px` estimate.
- Skip all of them if the default behavior already looks good enough.

Use `getState().getAverageItemSizes()` after rows have measured to inspect the current measured averages by item type:

```ts
ref.current?.getState().getAverageItemSizes();
```

For per-row diagnostics, use `onItemSizeChanged` to log actual size changes. Without estimates, Legend List defaults to `100px`, which is usually good enough; set `estimatedItemSize` only when that default causes noticeably too many or too few initial containers.

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

### Use Adaptive Rendering for Heavy Rows

```ts
experimental_adaptiveRender?: {
  initialMode?: "normal" | "light";
  enterVelocity?: number;
  exitVelocity?: number;
  exitDelay?: number;
  onChange?: (mode: "normal" | "light") => void;
};
```

If rows render charts, media, rich previews, or other expensive UI, enable `experimental_adaptiveRender` so they can switch to cheaper content during fast scrolls and back to full content after scrolling slows.

Use item hooks for row-local behavior, or `experimental_adaptiveRender.onChange` to write the mode into global state. See [experimental_adaptiveRender](../api#experimental_adaptiverender) for the full API and usage patterns.
