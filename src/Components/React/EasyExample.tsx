import { useRef } from "react";
import { Editor } from "../Editor/Editor";
import { Memo, useObservable } from "@legendapp/state/react";
import { useInterval } from "usehooks-ts";

const EASY_EXAMPLE_CODE = `function EasyExample() {
  const renderCount = ++useRef(0).current;
  const state = useObservable({ count: 0 });

  useInterval(() => {
      state.count.set((c) => c + 1);
  }, 500);

  return (
      <div className="text-md bg-slate-600 p-5" style={{ width: 300 }}>
          <div>Renders: {renderCount}</div>
          <Memo>
              {() => <div className="pt-4">Count: {state.count.get()}</div>}
          </Memo>
      </div>
  );
}

render(<EasyExample />)
`;

export function EasyExampleComponent() {
  return (
    <Editor
      code={EASY_EXAMPLE_CODE}
      scope={{
        useRef,
        useObservable,
        useInterval,
        Memo,
      }}
    />
  );
}
