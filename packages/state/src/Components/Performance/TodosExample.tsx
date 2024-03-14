import { useEffect, useRef, useState } from "react";
import { Editor } from "shared/src/Components/Editor/Editor";
import { For, observer, useObservable } from "@legendapp/state/react";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { Box } from "shared/src/Components/Box";
import { Button } from "shared/src/Components/Button";

const TODOS_CODE = `
import { useEffect, useRef, useState } from "react"
import { For, observer, useObservable } from "@legendapp/state/react"
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents"

enableReactComponents()

let total = 0
const TodosExample = () => {
  const renderCount = ++useRef(0).current
  const todos$ = useObservable([])

  const onClickAdd = () => (
    todos$.push({ id: ++total, text: total + '. Item', renders: 1 })
  )
  const onClickUpdate = () => {
    todos$[todos$.length - 1].text.set((t) => t + '!')
  }

  return (
    <Box>
      <Button onClick={onClickAdd}>
        Add
      </Button>
      <Button onClick={onClickUpdate}>
        Update Latest
      </Button>
      <div>Renders: {renderCount}</div>
      <div className="messages">
        <div className="hint">(text) - (renders)</div>
        <For each={todos$}>
          {(item) => {
            useEffect(() => {
              item.renders.set((r) => r + 1)
            })
            return (
              <div>
                {item.text.get()} - {item.renders.peek()}
              </div>
            )
          }}
        </For>
      </div>
    </Box>
  )
}
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
        Box,
        Button,
      }}
      noInline={true}
      previewWidth={200}
      renderCode=";render(<TodosExample />)"
      transformCode={(code) =>
        code
          .replace(
            /className="messages"/g,
            'className="rounded-lg p-4 text-sm h-[24rem] overflow-auto bg-gray-700"'
          )
          .replace(/className="hint"/g, 'className="pb-2 text-gray-400"')
      }
    />
  );
}


