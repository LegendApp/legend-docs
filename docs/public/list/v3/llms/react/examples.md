## Chat Playground

This demo combines the core behaviors needed for production chat feeds:

- `onStartReached` prepends older messages from the top
- `maintainVisibleContentPosition` keeps the viewport stable while prepending
- `initialScrollIndex` starts the feed at the latest messages
- `maintainScrollAtEndThreshold` controls bottom-follow behavior
- Sticky day boundaries are always enabled

<ChatPlaygroundDemo />
