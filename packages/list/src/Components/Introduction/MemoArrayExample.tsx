import { Memo, useObservable } from "@legendapp/state/react";
import { useRef } from "react";
import { Box } from "shared/src/Components/Box";
import { Editor } from "shared/src/Components/Editor/Editor";
import { useInterval } from "usehooks-ts";

const MEMO_ARRAY_EXAMPLE_CODE = `
import { useRef } from "react"
import { useInterval } from "usehooks-ts"
import { Memo, useObservable } from "@legendapp/state/react"

function MemoArrayExample() {
  const renderCount = ++useRef(0).current
  const messages$ = useObservable([])

  useInterval(() => {
    messages$.splice(0, 0, \`Message \${messages$.length + 1}\`)
  }, 600)

  return (
    <Box>
      <h5 className="renders">Renders: {renderCount}</h5>
      <div className="messages">
        <Memo>
          {() => (
            messages$.map((message$, i) => (
              <div key={i}>{message$.get()}</div>
            ))
          )}
        </Memo>
      </div>
    </Box>
  )
}
`;

export function MemoArrayExampleComponent() {
  return (
    <Editor
      code={MEMO_ARRAY_EXAMPLE_CODE}
      scope={{
        useRef,
        useObservable,
        Memo,
        useInterval,
        Box,
      }}
      noInline
      previewWidth={180}
      renderCode=";render(<MemoArrayExample />)"
      transformCode={(code) =>
        code
          .replace(
            /className="renders"/g,
            'className="border-b w-full pb-3 border-gray-500"'
          )
          .replace(
            /className="messages"/g,
            'className="h-[300px] overflow-auto w-full"'
          )
      }
    />
  );
}
