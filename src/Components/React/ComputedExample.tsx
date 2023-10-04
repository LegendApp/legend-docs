import { useRef, useState } from "react";
import { Editor } from "../Editor/Editor";
import { Computed, useObservable } from "@legendapp/state/react";
import { useInterval } from "usehooks-ts";

const COMPUTED_EXAMPLE_CODE = `const ComputedExample = () => {
  const renderCount = ++useRef(-1).current;
  const state$ = useObservable({ count: 0 });
  const [value, setValue] = useState(1);

  useInterval(() => {
      state$.count.set((v) => v + 1);
  }, 500);

  const onClick = () => setValue((v) => v + 1);

  return (
      <div className="p-4 text-md bg-slate-800" style={{ width: 240 }}>
          <div>Renders: {Math.max(renderCount, 1)}</div>
          <div>Value: {value}</div>
          <button
              className="block px-4 py-2 my-8 font-bold bg-gray-700 rounded shadow text-2xs hover:bg-gray-600 active:bg-gray-500"
              onClick={onClick}
          >
              Render parent
          </button>
          <Computed>
              {() => <>
                  <div>Value: {value}</div>
                  <div className="pt-4">Count: {state$.count.get()}</div>
              </>}
          </Computed>
      </div>
  );
};

render(<ComputedExample />)
`;

export function ComputedComponent() {
  return (
    <Editor
      code={COMPUTED_EXAMPLE_CODE}
      scope={{
        useRef,
        useObservable,
        useState,
        Computed,
        useInterval,
      }}
    />
  );
}
