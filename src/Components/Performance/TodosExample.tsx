import { useEffect, useRef, useState } from "react";
import { Editor } from "../Editor/Editor";
import { For, observer, useObservable } from "@legendapp/state/react";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";

const TODOS_CODE = `enableReactComponents();
let total = 0;
const TodosExample = () => {
    const renderCount = ++useRef(-1).current;
    // const [value, setValue] = useState(1);
    const todos = useObservable<{ id: number; text: string; renders: number }[]>([]);

    // const onClickRender = () => setValue((v) => v + 1);
    const onClickAdd = () => todos.push({ id: ++total, text: total + '. Item', renders: 1 });
    const onClickUpdate = () => {
        todos[todos.length - 1].text.set((t) => t + '!');
    };

    return (
        <div className="self-stretch p-4 text-md bg-slate-800">
            <div>
                <button
                    className="block px-4 py-2 my-4 font-bold bg-gray-700 rounded shadow text-2xs hover:bg-gray-600 active:bg-gray-500"
                    onClick={onClickAdd}
                >
                    Add
                </button>
                <button
                    className="block px-4 py-2 my-4 font-bold bg-gray-700 rounded shadow text-2xs hover:bg-gray-600 active:bg-gray-500"
                    onClick={onClickUpdate}
                >
                    Update
                </button>
                <div>Renders: {Math.max(renderCount, 1)}</div>
            </div>
            <div className="pt-4 text-sm h-[34rem]">
                <div className="pb-2 text-gray-500">{\`{text} {renders}\`}</div>
                <For each={todos}>
                    {(item) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            item.renders.set((r) => r + 1);
                        });
                        return (
                            <div>
                                {item.text.get()} {item.renders.peek()}
                            </div>
                        );
                    }}
                </For>
            </div>
        </div>
    );
};

render(<TodosExample />)
`;

export function TodosComponent() {
  return (
    <Editor
      code={TODOS_CODE}
      scope={{
        useRef,
        useObservable,
        For,
        useState,
        observer,
        enableReactComponents,
        useEffect,
      }}
      noInline={true}
    />
  );
}
