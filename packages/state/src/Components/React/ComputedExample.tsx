import { observable } from "@legendapp/state";
import { Computed, observer, useObservable } from "@legendapp/state/react";
import React, { useRef, useState } from "react";
import { Box } from "shared/src/Components/Box";
import { Button } from "shared/src/Components/Button";
import { Editor } from "shared/src/Components/Editor/Editor";
import { useInterval } from "usehooks-ts";

const COMPUTED_CODE = `
const ComputedExample = () => {
  const renderCount = ++useRef(0).current;

  const [value, setValue] = useState(1);

  // Only the Computed component tracks this
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
      <Computed>
        {() => <>
          <h5>Computed</h5>
          <div>Value: {value}</div>
          <div>Count: {state$.count.get()}</div>
        </>}
      </Computed>
    </Box>
  );
}
`;

export function ComputedExampleComponent() {
  return (
    <Editor
      code={COMPUTED_CODE}
      scope={{
        Box,
        useRef,
        useObservable,
        Computed,
        observable,
        useInterval,
        observer,
        React,
        useState,
        Button,
      }}
      noInline
      previewWidth={180}
      renderCode=";render(<ComputedExample />)"
    />
  );
}
