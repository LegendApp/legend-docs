Legend List is very optimized by default, so it may already be working well without any configuration. But these are some common ways to improve your list behavior.

`estimatedItemSize` and `getEstimatedItemSize` are optional optimizations.
Legend List works without them. If you provide them, they can reduce mount-time work by helping Legend List allocate a viewport-sized set of items more accurately before real measurements are available. If you omit them, Legend List falls back to measured averages and a default initial estimate of `100px`.

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

Legend List has an optional `recycleItems` prop which enables view recycling. This will reuse the component rendered by your `renderItem` function. This can be a big performance optimization because it does not need to destroy/create views while scrolling. But it also reuses any local state, which can cause some weird behavior that may not be desirable depending on your app. But see the [recycling hooks](../api#userecyclingstate) to make that easier.

So there are some tradeoffs with recycling:

- 👍 If you have items with no state then recycling should be great
- 👎 If you have simple items with complex state then it may be more trouble than it's worth
- 👍 If you have heavy items with complex state then working around the state recycling may be worth it for the performance gains

### Avoid `extraData`

```ts
extraData?: any;
```

Avoid `extraData` when possible.

Changing `extraData` causes Legend List to re-render all items because the value is passed through every `renderItem` call. This is convenient, but it pushes shared state changes through the whole list.

Prefer reading the state each item needs inside the item itself:

- Use React context when the state is naturally scoped that way.
- Use a state library selector so each item subscribes only to the values it needs.
- Avoid passing frequently changing shared state through the list just to reach `renderItem`.

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

Use `estimatedItemSize` or `getEstimatedItemSize` only if you want to optimize the first render. They are not required for correctness.

Providing accurate item size estimates helps determine the number of containers to allocate, based on screen size / estimatedItemSize. `estimatedItemSize` is used only for the first render, then Legend List switches to using the average of actually rendered item sizes. If you provide `getEstimatedItemSize`, it will use that function instead of averages. The more accurate your initial estimates, the less extra mount-time work Legend List needs to do before measurements arrive.

As a rule of thumb:

- Use `getFixedItemSize` when item sizes are truly fixed.
- Use `estimatedItemSize` when most items are roughly the same size.
- Use `getEstimatedItemSize` when item sizes vary and you can predict them reasonably well.
- Skip all of them if the default behavior already looks good enough.

Use `onItemSizeChanged` to log actual vs estimated sizes and improve your estimates over time. It's generally better to slightly underestimate than overestimate item sizes. Without estimates, Legend List defaults to 100px, which can make the initial container allocation less efficient until real measurements are collected.

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
