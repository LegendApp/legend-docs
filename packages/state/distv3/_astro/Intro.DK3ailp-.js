import{b as o,d as n,i,t as c,e as m,j as l,o as g,c as h,a as p,f as b}from"./index.BSHcnaqT.js";import{r}from"./index.SSXOyoI7.js";import{p as u}from"./persist.Bc5jZ15S.js";import{B as d}from"./Box.RILDG8lM.js";import{B as f}from"./Button.ClJkF7xk.js";import{E as v}from"./Editor.C2n4p8Q8.js";const x=r.createContext(0);function E(){if(!c.current)try{if(r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current)return r.useContext(x),!0}catch{}return!1}function R({auto:t,warnUnobserved:C}){const{get:s}=m;o({observableFunctions:{get:(a,e)=>E()&&t?n(()=>s(a,e),i(e)?e:void 0):s(a,e)}})}const _=`
import { observable, observe } from "@legendapp/state"
import { persistObservable } from "@legendapp/state/persist"
import { observer } from "@legendapp/state/react"
import { enableReactTracking } from "@legendapp/state/config/enableReactTracking"

// Create an observable object
const state$ = observable({ settings: { theme: 'dark' } })

// get() returns the raw data
state$.settings.theme.get() === 'dark'

// observe re-runs when any observables change
observe(() => {
  console.log(state$.settings.theme.get())
})

// Assign to state$ with set
state$.settings.theme.set('light')

// Automatically persist state$. Refresh this page to try it.
persistObservable(state$, { local: 'exampleState' })

// Automatically re-render components when observables change
enableReactTracking({ auto: true })

// This is the code for the example on your right ----->
function Component() {
  // theme is automatically tracked for changes
  const theme = state$.settings.theme.get()

  const toggle = () => {
    state$.settings.theme.set(theme =>
      theme === 'dark' ? 'light' : 'dark'
    )
  }

  return (
    <Box theme={theme}>
      <div>Theme: {theme}</div>
      <Button
        theme={theme}
        onClick={toggle}
      >
        Toggle theme
      </Button>
    </Box>
  )
}
`;function S(){return l.jsx(v,{code:_,scope:{observable:g,classNames:h,observer:p,observe:b,persistObservable:u,Button:f,enableReactTracking:R,Box:d},noInline:!0,renderCode:";render(<Component />)",previewWidth:180})}export{S as IntroExampleComponent};
