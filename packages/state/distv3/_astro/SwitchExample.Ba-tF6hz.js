import{j as e,u as t,l as r}from"./index.BSHcnaqT.js";import{r as o}from"./index.SSXOyoI7.js";import{B as i}from"./Box.RILDG8lM.js";import{B as n}from"./Button.ClJkF7xk.js";import{E as s}from"./Editor.C2n4p8Q8.js";const d=`
import { Switch, useObservable } from "@legendapp/state/react"
import { useRef } from "react"

function SwitchExample() {
  const renderCount = ++useRef(0).current
  const index$ = useObservable(0)

  const onClick = () => index$.set((v) => (v > 2 ? 0 : v + 1))

  return (
    <Box>
      <div>Renders: {renderCount}</div>
      <Button onClick={onClick}>
        Next tab
      </Button>
      <Switch value={index$}>
        {{
          0: () => <div>Tab 1</div>,
          1: () => <div>Tab 2</div>,
          2: () => <div>Tab 3</div>,
          3: () => <div>Error</div>,
        }}
      </Switch>
    </Box>
  )
}
`;function p(){return e.jsx(s,{code:d,scope:{useRef:o.useRef,useObservable:t,Switch:r,Box:i,Button:n},noInline:!0,previewWidth:160,renderCode:";render(<SwitchExample />)"})}export{p as SwitchComponent};
