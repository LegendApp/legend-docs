import{j as s,u as r,M as o}from"./index.BSHcnaqT.js";import{r as a}from"./index.SSXOyoI7.js";import{B as m}from"./Box.RILDG8lM.js";import{E as t}from"./Editor.C2n4p8Q8.js";import{u as n}from"./useIsomorphicLayoutEffect.CrH7GU3n.js";const l=`
import { useRef } from "react"
import { useInterval } from "usehooks-ts"
import { Memo, useObservable } from "@legendapp/state/react"

function MemoArrayExample() {
  const renderCount = ++useRef(0).current
  const messages$ = useObservable([])

  useInterval(() => {
    messages$.splice(0, 0, \`Message \${messages$.length + 1}\`)
  }, 600)

  return (
    <Box>
      <h5 className="renders">Renders: {renderCount}</h5>
      <div className="messages">
        <Memo>
          {() => (
            messages$.map((m, i) => (
              <div key={i}>{m}</div>
            ))
          )}
        </Memo>
      </div>
    </Box>
  )
}
`;function f(){return s.jsx(t,{code:l,scope:{useRef:a.useRef,useObservable:r,Memo:o,useInterval:n,Box:m},noInline:!0,previewWidth:180,renderCode:";render(<MemoArrayExample />)",transformCode:e=>e.replace(/className="renders"/g,'className="border-b w-full pb-3 border-gray-500"').replace(/className="messages"/g,'className="h-[300px] overflow-auto w-full"')})}export{f as MemoArrayExampleComponent};
