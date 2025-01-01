import { Memo, useObservable } from "@legendapp/state/react";
import { useRef } from "react";
import { Box } from "shared/src/Components/Box";
import { Editor } from "shared/src/Components/Editor/Editor";
import { useInterval } from "usehooks-ts";

const EASY_EXAMPLE_CODE = `
import { useRef } from "react"
import { useInterval } from "usehooks-ts"
import { Memo, useObservable } from "@legendapp/state/react"

function EasyExample() {
  const renderCount = ++useRef(0).current
  const state$ = useObservable({ count: 0 })

  useInterval(() => {
      state$.count.set((c) => c + 1)
  }, 500)

  return (
      <Box>
          <div>Renders: {renderCount}</div>
          <div>Count: <Memo>{state$.count}</Memo></div>
      </Box>
  )
}
`;

export function EasyExampleComponent() {
  return (
    <Editor
      name="easy"
      code={EASY_EXAMPLE_CODE.trim()}
      scope={{
        useRef,
        useObservable,
        useInterval,
        Memo,
        Box,
      }}
    />
  );
}
