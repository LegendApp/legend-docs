import{j as t,u as o,M as r,o as s,a}from"./index.BSHcnaqT.js";import{r as e}from"./index.SSXOyoI7.js";import{B as n}from"./Box.RILDG8lM.js";import{B as u}from"./Button.ClJkF7xk.js";import{E as m}from"./Editor.C2n4p8Q8.js";import{u as i}from"./useIsomorphicLayoutEffect.CrH7GU3n.js";const l=`
import { useInterval } from "usehooks-ts"
import { observable } from "@legendapp/state"
import { useRef, useState } from "react"
import { Memo, observer, useObservable } from "@legendapp/state/react"

const MemoExample = () => {
  const renderCount = ++useRef(0).current

  const [value, setValue] = useState(1)

  // Only the Memo'd component tracks this
  const state$ = useObservable({ count: 1 })
  useInterval(() => {
    state$.count.set((v) => v + 1)
  }, 500)

  // Force a render
  const onClick = () => setValue((v) => v + 1)

  return (
    <Box center>
      <h5>Normal</h5>
      <div>Renders: {renderCount}</div>
      <div>Value: {value}</div>
      <Button onClick={onClick}>
        Render
      </Button>
      <Memo>
        {() => <>
          <h5>Memo'd</h5>
          <div>Value: {value}</div>
          <div>Count: {state$.count.get()}</div>
        </>}
      </Memo>
    </Box>
  )
}
`;function M(){return t.jsx(m,{code:l,scope:{Box:n,useRef:e.useRef,useObservable:o,Memo:r,observable:s,useInterval:i,observer:a,useState:e.useState,Button:u},noInline:!0,previewWidth:180,renderCode:";render(<MemoExample />)"})}export{M as MemoExampleComponent};
