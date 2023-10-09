import { useRef } from "react";
import { Editor } from "../Editor/Editor";
import { Show, useObservable } from "@legendapp/state/react";

const SHOW_EXAMPLE_CODE = `const ShowExample = () => {
  const renderCount = ++useRef(-1).current;
  const state = useObservable({ show: false });

  const onClick = () => state.show.set(show => !show);

  return (
      <div className="p-4 text-md bg-slate-800" style={{ width: 260, height: 300 }}>
          <div>Renders: {Math.max(renderCount, 1)}</div>
          <button
              className="block px-4 py-2 my-8 font-bold bg-gray-700 rounded shadow text-2xs hover:bg-gray-600 active:bg-gray-500"
              onClick={onClick}
          >
              Toggle
          </button>
          <Show if={state.show} else={<div className="text-xs text-gray-500">Nothing to see here</div>}>
              <div className="p-6 my-4 font-bold text-center bg-gray-700 rounded-lg shadow">Modal</div>
          </Show>
      </div>
  );
};

render(<ShowExample />)
`;

export function ShowComponent() {
  return (
    <Editor
      code={SHOW_EXAMPLE_CODE}
      scope={{
        useRef,
        useObservable,
        Show,
      }}
      noInline={true}
    />
  );
}
