import { useRef } from "react";
import { Editor } from "shared/src/Components/Editor/Editor";
import { Switch, useObservable } from "@legendapp/state/react";

const SWITCH_EXAMPLE_CODE = `const SwitchExample = () => {
  const renderCount = ++useRef(-1).current;
  const index = useObservable(0);

  const onClick = () => index.set((v) => (v > 2 ? 0 : v + 1));

  return (
      <div className="bg-slate-800 p-4" style={{ width: 240 }}>
          <div className="pb-2">Renders: {renderCount}</div>
          <button
              className="block px-4 py-2 my-8 font-bold bg-gray-700 rounded shadow text-2xs hover:bg-gray-600 active:bg-gray-500"
              onClick={onClick}
          >
              Next tab
          </button>
          <div className="text-md">
              <Switch value={index}>
                  {{
                      0: () => <div>Tab 1</div>,
                      1: () => <div>Tab 2</div>,
                      2: () => <div>Tab 3</div>,
                      3: () => <div>Error</div>,
                  }}
              </Switch>
          </div>
      </div>
  );
};

render(<SwitchExample />)
`;

export function SwitchComponent() {
  return (
    <Editor
      code={SWITCH_EXAMPLE_CODE}
      scope={{
        useRef,
        useObservable,
        Switch,
      }}
      noInline={true}
    />
  );
}
