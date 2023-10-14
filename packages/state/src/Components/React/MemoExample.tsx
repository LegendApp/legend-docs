import { observable } from "@legendapp/state";
import
    {
        Memo,
        observer,
        useObservable,
    } from "@legendapp/state/react";
import { useRef, useState } from "react";
import { Box } from "shared/src/Components/Box";
import { Button } from "shared/src/Components/Button";
import { Editor } from "shared/src/Components/Editor/Editor";
import { useInterval } from "usehooks-ts";

const MEMO_CODE = `
import { useInterval } from "usehooks-ts";
import { observable } from "@legendapp/state";
import { useRef, useState } from "react";
import { Memo, observer, useObservable } from "@legendapp/state/react";

const MemoExample = () => {
  const renderCount = ++useRef(0).current;

  const [value, setValue] = useState(1);

  // Only the Memo'd component tracks this
  const state$ = useObservable({ count: 1 });
  useInterval(() => {
    state$.count.set((v) => v + 1);
  }, 500);

  // Force a render
  const onClick = () => setValue((v) => v + 1);

  return (
    <Box center>
      <h5>Normal</h5>
      <div>Renders: {renderCount}</div>
      <div>Value: {value}</div>
      <Button onClick={onClick}>
        Render
      </Button>
      <Memo>
        {() => <>
          <h5>Memo'd</h5>
          <div>Value: {value}</div>
          <div>Count: {state$.count.get()}</div>
        </>}
      </Memo>
    </Box>
  );
}
`;

export function MemoExampleComponent() {
  return (
    <Editor
      code={MEMO_CODE}
      scope={{
        Box,
        useRef,
        useObservable,
        Memo,
        observable,
        useInterval,
        observer,
        useState,
        Button,
      }}
      noInline
      previewWidth={180}
      renderCode=";render(<MemoExample />)"
    />
  );
}
