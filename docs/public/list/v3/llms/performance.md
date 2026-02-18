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
