import { Box } from "shared/src/Components/Box";
import { Button } from "shared/src/Components/Button";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import {
  For,
  Memo,
  Reactive,
  Show,
  useObservable,
} from "@legendapp/state/react";
import { useFetch } from "@legendapp/state/react-hooks/useFetch";
import { useRef } from "react";
import { Editor } from "shared/src/Components/Editor/Editor";

const MESSAGE_LIST_CODE = `
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents"
import { For, Reactive, Show, useObservable, useObservable } from "@legendapp/state/react"
import { useFetch } from "@legendapp/state/react-hooks/useFetch"

// Enable Reactive.input
enableReactComponents()

let nextID = 0
function generateID() {
  return nextID ++
}

function App() {
  const renderCount = ++useRef(0).current

  // Create profile from fetch promise
  const {
    data: { data: profile },
  } = useFetch('https://reqres.in/api/users/1')

  // Username
  const userName = useObservable(() => {
    const p = profile.get()
    return p ?
        p.first_name + ' ' + p.last_name :
        ''
  })

  // Chat state
  const { messages, currentMessage } = useObservable({
    messages: [],
    currentMessage: ''
  })

  // Button click
  const onClickAdd = () => {
    messages.push({
      id: generateID(),
      text: currentMessage.get(),
    })
    currentMessage.set('')
  }

  return (
    <Box>
      <div>Renders: {renderCount}</div>
      <Show if={userName} else={<div>Loading...</div>}>
        <div>Chatting with <Memo>{userName}</Memo></div>
      </Show>
      <div className="messages">
        <For each={messages}>
          {(message) => <div>{message.text.get()}</div>}
        </For>
      </div>
      <div className="flex gap-2 items-center">
        <Reactive.input
          className="input"
          placeholder="Enter message"
          $value={currentMessage}
          onKeyDown={e => e.key === 'Enter' && onClickAdd()}
        />
        <Button onClick={onClickAdd}>
          Send
        </Button>
      </div>
    </Box>
  )
}
`;

export function MessageListComponent() {
  return (
    <Editor
      code={MESSAGE_LIST_CODE}
      scope={{
        useRef,
        enableReactComponents,
        Reactive,
        useFetch,
        useObservable,
        useObservable,
        Show,
        Memo,
        For,
        Box,
        Button,
      }}
      noInline={true}
      renderCode=";render(<App />)"
      transformCode={(code) =>
        code
          .replace(
            /className="input"/g,
            'className="bg-gray-900 text-white border rounded border-gray-600 px-2 py-1"'
          )
          .replace(
            /className="messages"/g,
            'className="h-64 p-2 my-3 overflow-auto border border-gray-600 rounded [&>*]:!mt-2"'
          )
      }
    />
  );
}
