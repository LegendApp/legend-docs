import{j as t,o,r,R as s}from"./index.BSHcnaqT.js";import{e as a}from"./enableReactComponents.DERDCpxv.js";import{p as i}from"./persist.Bc5jZ15S.js";import{O as n}from"./local-storage.DCJdSzu0.js";import{r as m}from"./index.SSXOyoI7.js";import{B as p}from"./Box.RILDG8lM.js";import{B as l}from"./Button.ClJkF7xk.js";import{E as c}from"./Editor.C2n4p8Q8.js";import{m as d}from"./motion.CuwXudW8.js";const g=`
import { observable } from "@legendapp/state"
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents"
import { persistObservable } from "@legendapp/state/persist"
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage"
import { reactive, Reactive } from "@legendapp/state/react"
import { motion } from "framer-motion"
import { useRef } from "react"

enableReactComponents()

const state$ = observable({
  settings: { showSidebar: false, theme: 'light' },
  user: {
    profile: { name: '', avatar: '' },
    messages: {}
  }
})

// Persist state
persistObservable(state$, {
  local: 'persistenceExample',
  pluginLocal: ObservablePersistLocalStorage,
})

// Create a reactive Framer-Motion div
const MotionDiv = reactive(motion.div)

function App() {
  const renderCount = ++useRef(0).current

  const sidebarHeight = () => (
    state$.settings.showSidebar.get() ? 96 : 0
  )

  return (
    <Box>
      <div>Renders: {renderCount}</div>
      <div>Username:</div>
      <Reactive.input
        className="input"
        $value={state$.user.profile.name}
      />
      <Button onClick={state$.settings.showSidebar.toggle}>
        Toggle footer
      </Button>
      <MotionDiv
        className="footer"
        $animate={() => ({
           height: state$.settings.showSidebar.get() ?
             96 : 0
        })}
      >
        <div className="p-4">Footer</div>
      </MotionDiv>
    </Box>
  )
}
`;function S(){return t.jsx(c,{code:g,scope:{useRef:m.useRef,observable:o,persistObservable:i,enableReactComponents:a,ObservablePersistLocalStorage:n,reactive:r,motion:d,Reactive:s,Button:l,Box:p},noInline:!0,previewWidth:210,renderCode:";render(<App />)",transformCode:e=>e.replace(/className="footer"/g,'className="bg-gray-600 text-center text-white text-sm overflow-hidden"').replace(/className="input"/g,'className="bg-gray-900 text-white border rounded border-gray-600 px-2 py-1 mt-2"')})}export{S as PersistenceComponent};
