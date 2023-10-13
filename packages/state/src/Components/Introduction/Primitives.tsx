import React, { useRef, useState } from "react";
import { useInterval } from "usehooks-ts";
import { FlashingDiv } from "../FlashingDiv/FlashingDiv";
import { observable } from "@legendapp/state";
import { Memo, useObservable } from "@legendapp/state/react";
import { Editor } from "shared/src/Components/Editor/Editor";

export function OptimizedPrimitive() {
  const count$ = useObservable(0);
  const renderCount = useRef(0).current++;

  useInterval(() => {
    count$.set((v) => v + 1);
  }, 600);

  // This re-renders when count changes
  return (
    <div className="text-sm" style={{ width: "150px" }}>
      <FlashingDiv className="mt-8">
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="pb-3 font-bold text-md">Fine-grained</div>
          <div className="pb-2">Renders: {Math.max(renderCount, 1)}</div>
          <div>
            Count:{" "}
            <Memo>
              {() => (
                <FlashingDiv span className="bg-gray-800">
                  {count$.get()}
                </FlashingDiv>
              )}
            </Memo>
          </div>
        </div>
      </FlashingDiv>
    </div>
  );
}

const NORMAL_CODE = `
function Normal() {
  const [count, setCount] = useState(1);
  const renderCount = useRef(1).current++;

  useInterval(() => {
    setCount((v) => v + 1);
  }, 600);

  // This re-renders when count changes
  return (
    <FlashingDiv>
      <h5>Normal</h5>
      <div>Renders: {renderCount}</div>
      <div>Count: {count}</div>
    </FlashingDiv>
  )
}
function FineGrained() {
  const count$ = useObservable(1);
  const renderCount = useRef(1).current++;

  useInterval(() => {
    count$.set((v) => v + 1);
  }, 600);

  // The text updates itself so the component doesn't re-render
  return (
    <FlashingDiv className="!mt-8">
      <h5>Fine-grained</h5>
      <div>Renders: {renderCount}</div>
      <div>Count:{" "}
        <Memo>
          {() => (
            <FlashingDiv span className="bg-gray-800">
                {count$.get()}
            </FlashingDiv>
          )}
        </Memo>
      </div>
    </FlashingDiv>
  )
}
`;

const NORMAL_CODE_SIMPLE = `
function Normal() {
  const [count, setCount] = useState(1);

  useInterval(() => {
    setCount(v => v + 1)
  }, 600)

  // This re-renders when count changes
  return (
    <div>
      Count: {count}
    </div>
  )
}
function FineGrained() {
  const count$ = useObservable(1)

  useInterval(() => {
    count$.set(v => v + 1)
  }, 600)

  // The text updates itself so the component doesn't re-render
  return (
    <div>
      Count: <Memo>{count$}</Memo>
    </div>
  )
}
`;

export function Primitives() {
  return (
    <div>
      <Editor
        code={NORMAL_CODE}
        simpleCode={NORMAL_CODE_SIMPLE}
        noInline
        renderCode=";render(<div><Normal /><FineGrained /></div>)"
        previewWidth={150}
        scope={{
          useState,
          useRef,
          useInterval,
          FlashingDiv,
          useObservable,
          Memo,
          observable,
        }}
      />
    </div>
  );
}
