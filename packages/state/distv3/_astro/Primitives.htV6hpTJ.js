import{j as s,c as i,u as c,M as m,o as d}from"./index.BSHcnaqT.js";import{r}from"./index.SSXOyoI7.js";import{E as l}from"./Editor.C2n4p8Q8.js";import{u as v}from"./useIsomorphicLayoutEffect.CrH7GU3n.js";import{a as p,s as f,u as h,b,m as C}from"./motion.CuwXudW8.js";function g(e){e.values.forEach(o=>o.stop())}function E(){const e=new Set,o={subscribe(t){return e.add(t),()=>void e.delete(t)},start(t,n){const a=[];return e.forEach(u=>{a.push(p(u,t,{transitionOverride:n}))}),Promise.all(a)},set(t){return e.forEach(n=>{f(n,t)})},stop(){e.forEach(t=>{g(t)})},mount(){return()=>{o.stop()}}};return o}function x(){const e=h(E);return b(e.mount,[]),e}const F=x;function M({span:e,className:o,children:t}){const n=F();return r.useEffect(()=>{n.start({opacity:.2,transition:{duration:.1}}).then(()=>{n.start({opacity:0,transition:{duration:.2}})})}),s.jsxs("span",{className:i("relative",e?"p-1":"block p-1",o),children:[s.jsx(C.div,{animate:n,className:"absolute inset-0 rounded-lg opacity-0 bg-blue-100"}),s.jsx("span",{className:i("relative z-10 bg-gray-800 rounded-lg",e?"px-2":"block p-4"),children:t})]})}const I=`
import { observable } from "@legendapp/state"
import { Memo, useObservable } from "@legendapp/state/react"
import { useRef, useState } from "react"
import { useInterval } from "usehooks-ts"

function NormalComponent() {
  const [count, setCount] = useState(1)
  const renderCount = useRef(1).current++

  useInterval(() => {
    setCount((v) => v + 1)
  }, 600)

  // This re-renders when count changes
  return (
    <FlashingDiv>
      <h5>Normal</h5>
      <div>Renders: {renderCount}</div>
      <div>Count: {count}</div>
    </FlashingDiv>
  )
}
function FineGrained() {
  const count$ = useObservable(1)
  const renderCount = useRef(1).current++

  useInterval(() => {
    count$.set((v) => v + 1)
  }, 600)

  // The text updates itself so the component doesn't re-render
  return (
    <FlashingDiv>
      <h5>Fine-grained</h5>
      <div>Renders: {renderCount}</div>
      <div>Count: <Memo>{count$}</Memo></div>
    </FlashingDiv>
  )
}
`;function y(){return s.jsx("div",{children:s.jsx(l,{code:I,noInline:!0,renderCode:';render(<div><NormalComponent /><div className="!mt-4" /><FineGrained /></div>)',previewWidth:150,scope:{useState:r.useState,useRef:r.useRef,useInterval:v,FlashingDiv:M,useObservable:c,Memo:m,observable:d},transformCode:e=>e.replace("<div>Count: <Memo>{count$}</Memo></div>",`<div>Count:{" "}
                <Memo>
                    {() => (
                        <FlashingDiv span>
                            {count$.get()}
                        </FlashingDiv>
                    )}
                </Memo>
            </div>`)})})}export{y as Primitives};
