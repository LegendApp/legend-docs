import{j as t,u as o,C as r,o as s,a as u}from"./index.BSHcnaqT.js";import{r as e}from"./index.SSXOyoI7.js";import{B as a}from"./Box.RILDG8lM.js";import{B as n}from"./Button.ClJkF7xk.js";import{E as m}from"./Editor.C2n4p8Q8.js";import{u as p}from"./useIsomorphicLayoutEffect.CrH7GU3n.js";const d=`
import { useInterval } from "usehooks-ts"
import { useRef, useState } from "react"
import { observable } from "@legendapp/state"
import { Computed, observer, useObservable } from "@legendapp/state/react"

const ComputedExample = () => {
  const renderCount = ++useRef(0).current

  const [value, setValue] = useState(1)

  // Only the Computed component tracks this
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
      <Computed>
        {() => <>
          <h5>Computed</h5>
          <div>Value: {value}</div>
          <div>Count: {state$.count.get()}</div>
        </>}
      </Computed>
    </Box>
  )
}
`;function b(){return t.jsx(m,{code:d,scope:{Box:a,useRef:e.useRef,useObservable:o,Computed:r,observable:s,useInterval:p,observer:u,useState:e.useState,Button:n},noInline:!0,previewWidth:180,renderCode:";render(<ComputedExample />)"})}export{b as ComputedExampleComponent};
