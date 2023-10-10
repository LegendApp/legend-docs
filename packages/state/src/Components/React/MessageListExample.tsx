import { useRef } from "react";
import {
  useComputed,
  useObservable,
  useObserve,
  For,
  Memo,
  Reactive,
  Show,
} from "@legendapp/state/react";
import { useFetch } from "@legendapp/state/react-hooks/useFetch";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { Editor } from "shared/src/Components/Editor/Editor";

const MESSAGE_LIST_CODE = `enableReactComponents()

function App() {
  const renderCount = ++useRef(0).current

  // Create profile from fetch promise
  const {
    data: { data: profile },
  } = useFetch('https://reqres.in/api/users/1')

  // Username
  const userName = useComputed(() => {
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
    <div className="p-4 bg-slate-800">
      <div className="text-gray-500 text-sm pb-4">
        Renders: {renderCount}
      </div>
      <Show if={userName} else={<div>Loading...</div>}>
        <div>Chatting with <Memo>{userName}</Memo></div>
      </Show>
      <div className="h-64 p-2 my-3 overflow-auto border border-gray-300 rounded">
        <For each={messages}>{(message) => <div><Memo>{message.text}</Memo></div>}</For>
      </div>
      <div className="flex gap-2">
        <Reactive.input
          className="flex-1 px-2 border border-gray-300 rounded min-w-0"
          placeholder="Enter message"
          $value={currentMessage}
          onKeyDown={e => e.key === 'Enter' && onClickAdd()}
        />
        <button
          className="bg-gray-300 rounded-lg px-4 py-2"
          onClick={onClickAdd}
        >
          Send
        </button>
      </div>
    </div>
  )
}

let nextID = 0
function generateID() {
  return nextID ++
}

render(<App />)
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
        useComputed,
        useObservable,
        Show,
        Memo,
        For,
      }}
      noInline={true}
    />
  );
}
