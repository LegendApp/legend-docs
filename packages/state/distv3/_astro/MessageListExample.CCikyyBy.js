import{o as i,j as u,R as d,k as c,u as m,S as p,M as l,F as g}from"./index.BSHcnaqT.js";import{B as f}from"./Box.RILDG8lM.js";import{B as v}from"./Button.ClJkF7xk.js";import{e as h}from"./enableReactComponents.DERDCpxv.js";import{r as n}from"./index.SSXOyoI7.js";import{E as b}from"./Editor.C2n4p8Q8.js";function C(t,s,a){const o=i({data:void 0,error:void 0,errorStr:void 0,loading:!0});return fetch(t,s).then(e=>e[a||"json"]()).then(e=>o.set({data:e,loading:!1})).catch(e=>{var r;return o.set({loading:!1,error:e,errorStr:(r=e?.toString)===null||r===void 0?void 0:r.call(e)})}),o}function x(t,s,a){return n.useMemo(()=>C(t,s,a),[])}const R=`
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents"
import { For, Reactive, Show, useComputed, useObservable } from "@legendapp/state/react"
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
`;function k(){return u.jsx(b,{code:R,scope:{useRef:n.useRef,enableReactComponents:h,Reactive:d,useFetch:x,useComputed:c,useObservable:m,Show:p,Memo:l,For:g,Box:f,Button:v},noInline:!0,renderCode:";render(<App />)",transformCode:t=>t.replace(/className="input"/g,'className="bg-gray-900 text-white border rounded border-gray-600 px-2 py-1"').replace(/className="messages"/g,'className="h-64 p-2 my-3 overflow-auto border border-gray-600 rounded [&>*]:!mt-2"')})}export{k as MessageListComponent};
