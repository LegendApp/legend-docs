import{j as e,u as o,S as t}from"./index.BSHcnaqT.js";import{r}from"./index.SSXOyoI7.js";import{B as s}from"./Box.RILDG8lM.js";import{B as n}from"./Button.ClJkF7xk.js";import{E as a}from"./Editor.C2n4p8Q8.js";function i(){return e.jsx("div",{className:"p-6 my-4 font-bold text-center bg-gray-700 rounded-lg shadow",children:"Modal"})}function d(){return e.jsx("div",{className:"text-xs text-gray-500",children:"Nothing to see here"})}const u=`
import { Show, useObservable } from "@legendapp/state/react"
import { useRef } from "react"

const ShowExample = () => {
  const renderCount = ++useRef(0).current
  const state$ = useObservable({ show: false })

  return (
    <Box width={160}>
      <div>Renders: {renderCount}</div>
      <Button
        onClick={state$.show.toggle}
      >
        Toggle
      </Button>
      <Show if={state$.show} else={<Nothing />}>
        {() => <Modal />}
      </Show>
    </Box>
  )
}
`;function f(){return e.jsx(a,{code:u,scope:{useRef:r.useRef,useObservable:o,Show:t,Box:s,Button:n,Modal:i,Nothing:d},noInline:!0,previewWidth:160,renderCode:";render(<ShowExample />)"})}export{f as ShowComponent};
