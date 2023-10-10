import { useRef } from "react";
import { Editor } from "shared/src/Components/Editor/Editor";
import { Memo, useObservable } from "@legendapp/state/react";
import { useInterval } from "usehooks-ts";

const MEMO_ARRAY_EXAMPLE_CODE = `
  function MemoArrayExample() {
    const renderCount = ++useRef(0).current;
    const messages = useObservable([]);

    useInterval(() => {
        messages.splice(0, 0, \`Message \${messages.length + 1}\`);
    }, 1000);

    return (
        <div className="p-4 text-md bg-gray-800" style={{ width: 150 }}>
            <div>Renders: {renderCount}</div>
            <Memo>
                {() => <div className="pt-4 h-[300px] overflow-auto">
                    {messages.map((m, i) => (
                        <div key={i}>{m}</div>
                    ))}
                </div>}
            </Memo>
        </div>
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
      }}
    />
  );
}
