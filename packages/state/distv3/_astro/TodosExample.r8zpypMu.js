import{j as o,u as s,F as r,a}from"./index.BSHcnaqT.js";import{r as e}from"./index.SSXOyoI7.js";import{E as n}from"./Editor.C2n4p8Q8.js";import{e as d}from"./enableReactComponents.DERDCpxv.js";import{B as m}from"./Box.RILDG8lM.js";import{B as c}from"./Button.ClJkF7xk.js";const i=`
import { useEffect, useRef, useState } from "react"
import { For, observer, useObservable } from "@legendapp/state/react"
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents"

enableReactComponents()

let total = 0
const TodosExample = () => {
  const renderCount = ++useRef(0).current
  const todos$ = useObservable([])

  const onClickAdd = () => (
    todos$.push({ id: ++total, text: total + '. Item', renders: 1 })
  )
  const onClickUpdate = () => {
    todos$[todos$.length - 1].text.set((t) => t + '!')
  }

  return (
    <Box>
      <Button onClick={onClickAdd}>
        Add
      </Button>
      <Button onClick={onClickUpdate}>
        Update Latest
      </Button>
      <div>Renders: {renderCount}</div>
      <div className="messages">
        <div className="hint">(text) - (renders)</div>
        <For each={todos$}>
          {(item) => {
            useEffect(() => {
              item.renders.set((r) => r + 1)
            })
            return (
              <div>
                {item.text.get()} - {item.renders.peek()}
              </div>
            )
          }}
        </For>
      </div>
    </Box>
  )
}
`;function v(){return o.jsx(n,{code:i,scope:{useRef:e.useRef,useObservable:s,For:r,useState:e.useState,observer:a,enableReactComponents:d,useEffect:e.useEffect,Box:m,Button:c},noInline:!0,previewWidth:200,renderCode:";render(<TodosExample />)",transformCode:t=>t.replace(/className="messages"/g,'className="rounded-lg p-4 text-sm h-[24rem] overflow-auto bg-gray-700"').replace(/className="hint"/g,'className="pb-2 text-gray-400"')})}export{v as TodosComponent};
