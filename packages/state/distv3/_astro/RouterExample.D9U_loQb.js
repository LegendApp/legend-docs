import{o as h,j as u,M as m,l as f}from"./index.BSHcnaqT.js";import{r as g}from"./index.SSXOyoI7.js";import{E as w}from"./Editor.C2n4p8Q8.js";import{B as v}from"./Box.RILDG8lM.js";import{B as S}from"./Button.ClJkF7xk.js";let n={setter:"hash"};const d=typeof window<"u",i=h(d?window.location.hash.slice(1):"");if(d){let e=!1;i.onChange(({value:s})=>{if(!e){const t="#"+s,o=n?.setter||"hash";o==="pushState"?history.pushState(null,null,t):o==="replaceState"?history.replaceState(null,null,t):location.hash=t}});const a=()=>{e=!0,i.set(window.location.hash.slice(1)),e=!1};window.addEventListener("hashchange",a)}let r={setter:"hash"};function c(e){const a={},s=new URLSearchParams(e);for(const[t,o]of s)a[t]=o;return a}function H(e){return new URLSearchParams(e).toString().replace(/=$/,"")}const p=typeof window<"u",l=h(p?c(window.location.hash.slice(1)):{});if(p){let e=!1;l.onChange(({value:s})=>{if(!e){const t="#"+H(s),o=r?.setter||"hash";o==="pushState"?history.pushState(null,null,t):o==="replaceState"?history.replaceState(null,null,t):location.hash=t}});const a=()=>{e=!0,l.set(c(window.location.hash.slice(1))),e=!1};window.addEventListener("hashchange",a)}const B=`
import { useRef } from "react"
import { Memo, Switch } from "@legendapp/state/react"
import { pageHash } from "@legendapp/state/helpers/pageHash"
import { pageHashParams } from "@legendapp/state/helpers/pageHashParams"

function RouterExample() {
  const renderCount = ++useRef(0).current

  return (
    <Box width={240}>
      <div>Renders: {renderCount}</div>
      <div>
        <Button onClick={() => pageHashParams.page.delete()}>
          Go to root
        </Button>
        <Button onClick={() => pageHashParams.page.set('')}>
          Go to Page
        </Button>
        <Button onClick={() => pageHashParams.page.set('Home')}>
          Go Home
        </Button>
        <Button onClick={() => pageHashParams.page.set('asdf')}>
          Go to unknown
        </Button>
      </div>
        <div>Hash: <Memo>{pageHash}</Memo></div>
        <div className="p-4 bg-gray-600 rounded-xl">
          <Switch value={pageHashParams.page}>
            {{
              undefined: () => <div>Root</div>,
              '': () => <div>Page</div>,
              Home: () => <div>Home</div>,
              default: () => <div>Unknown page</div>,
            }}
          </Switch>
        </div>
    </Box>
  )
}
`;function y(){return u.jsx(w,{code:B,scope:{useRef:g.useRef,Memo:m,pageHash:i,pageHashParams:l,Switch:f,Box:v,Button:S},noInline:!0,renderCode:";render(<RouterExample />)"})}export{y as RouterComponent};
