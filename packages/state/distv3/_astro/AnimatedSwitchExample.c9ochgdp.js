import{j as o,o as t,r,k as a,M as n}from"./index.BSHcnaqT.js";import{r as s}from"./index.SSXOyoI7.js";import{E as i}from"./Editor.C2n4p8Q8.js";import{B as m}from"./Box.RILDG8lM.js";import{B as l}from"./Button.ClJkF7xk.js";import{m as d}from"./motion.CuwXudW8.js";const u=`
import { reactive } from "@legendapp/state/react"
import { motion } from "framer-motion"
import { useRef } from "react"
import { observable } from "@legendapp/state"
import { useComputed, Memo } from "@legendapp/state/react"

const MotionDiv = reactive(motion.div)

function Toggle({ $value }) {
  return (
    <MotionDiv
      className="toggle"
      $animate={() => ({
        backgroundColor: $value.get() ? '#6ACB6C' : '#515153'
      })}
      style={{ width: 64, height: 32 }}
      onClick={$value.toggle}
    >
      <MotionDiv
        className="thumb"
        style={{ width: 24, height: 24, marginTop: 3 }}
        $animate={() => ({
          x: $value.get() ? 34 : 4
        })}
      />
    </MotionDiv>
  )
}

const settings$ = observable({ enabled: false })

function App() {
  const renderCount = ++useRef(0).current

  // Computed text value
  const text = () => (
    settings$.enabled.get() ? 'Yes' : 'No'
  )

  return (
    <Box>
      <div>Renders: {renderCount}</div>
      <div>
        Enabled: <Memo>{text}</Memo>
      </div>
      <Toggle $value={settings$.enabled} />
    </Box>
  )
}
`;function C(){return o.jsx(i,{code:u,scope:{useRef:s.useRef,observable:t,reactive:r,motion:d,useComputed:a,Memo:n,Box:m,Button:l},noInline:!0,renderCode:";render(<App />)",previewWidth:128,transformCode:e=>e.replace(/className="toggle"/g,'className="border border-[#717173] rounded-full select-none"').replace(/className="thumb"/g,'className="bg-white rounded-full shadow"')})}export{C as AnimatedSwitchComponent};
