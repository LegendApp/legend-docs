import{j as e,u as t,M as o}from"./index.BSHcnaqT.js";import{r}from"./index.SSXOyoI7.js";import{B as s}from"./Box.RILDG8lM.js";import{E as a}from"./Editor.C2n4p8Q8.js";import{u as n}from"./useIsomorphicLayoutEffect.CrH7GU3n.js";const m=`
import { useRef } from "react"
import { useInterval } from "usehooks-ts"
import { Memo, useObservable } from "@legendapp/state/react"

function EasyExample() {
  const renderCount = ++useRef(0).current
  const state$ = useObservable({ count: 0 })

  useInterval(() => {
      state$.count.set((c) => c + 1)
  }, 500)

  return (
      <Box>
          <div>Renders: {renderCount}</div>
          <div>Count: <Memo>{state$.count}</Memo></div>
      </Box>
  )
}
`;function E(){return e.jsx(a,{name:"easy",code:m.trim(),scope:{useRef:r.useRef,useObservable:t,useInterval:n,Memo:o,Box:s}})}export{E as EasyExampleComponent};
