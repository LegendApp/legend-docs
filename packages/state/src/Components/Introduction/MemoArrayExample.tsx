import { useRef } from "react";
import { Editor } from "shared/src/Components/Editor/Editor";
import { Memo, useObservable } from "@legendapp/state/react";
import { useInterval } from "usehooks-ts";
import { Box } from "shared/src/Components/Box";

const MEMO_ARRAY_EXAMPLE_CODE = `
function MemoArrayExample() {
  const renderCount = ++useRef(0).current;
  const messages = useObservable([]);

  useInterval(() => {
    messages.splice(0, 0, \`Message \${messages.length + 1}\`);
  }, 600);

  return (
    <Box>
      <h5 className="border-b w-full pb-3">Renders: {renderCount}</h5>
      <div className="h-[300px] overflow-auto w-full">
        <Memo>
          {() => (
            messages.map((m, i) => (
              <div key={i}>{m}</div>
            ))
          )}
        </Memo>
      </div>
    </Box>
  );
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
    />
  );
}
