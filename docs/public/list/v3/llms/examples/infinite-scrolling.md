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
