import React, { useRef, useState } from "react";
import { useInterval } from "usehooks-ts";
import { FlashingDiv } from "../FlashingDiv/FlashingDiv";
import { observable } from "@legendapp/state";
import {
  Memo,
  useObservable,
  enableLegendStateReact,
} from "@legendapp/state/react";
import { Editor } from "../Editor/Editor";

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
    const [count, setCount] = useState(0);
    const renderCount = useRef(0).current++;

    useInterval(() => {
      setCount((v) => v + 1);
    }, 600);

    // This re-renders when count changes
    return (
      <div className="text-sm" style={{ width: "150px" }}>
        <FlashingDiv>
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="pb-3 font-bold text-md">Normal</div>
            <div className="pb-2">Renders: {Math.max(renderCount, 1)}</div>
            <div>Count: {count}</div>
          </div>
        </FlashingDiv>
      </div>
    );
  }
`;

const FINE_GRAINED = `
  function FineGrained() {
    const count$ = useObservable(0);
    const renderCount = useRef(0).current++;

    useInterval(() => {
      count$.set((v) => v + 1);
    }, 600);

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
`;

export function Primitive() {
  return (
    <div>
      <Editor
        code={NORMAL_CODE}
        scope={{ useState, useRef, useInterval, FlashingDiv }}
      />
      <Editor
        code={FINE_GRAINED}
        scope={{
          useObservable,
          useRef,
          useInterval,
          FlashingDiv,
          Memo,
          observable,
          enableLegendStateReact,
        }}
      />
    </div>
  );
}
