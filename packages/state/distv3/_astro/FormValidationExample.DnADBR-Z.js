import{j as s,R as r,u as a,h as o,M as t,S as n}from"./index.BSHcnaqT.js";import{r as m}from"./index.SSXOyoI7.js";import{e as u}from"./enableReactComponents.DERDCpxv.js";import{E as c}from"./Editor.C2n4p8Q8.js";import{B as i}from"./Box.RILDG8lM.js";import{B as d}from"./Button.ClJkF7xk.js";const p=`
import { useRef } from "react"
import { useObservable, useObserve, Reactive, Memo, Show } from "@legendapp/state/react"
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents"

enableReactComponents()

function App() {
  const renderCount = ++useRef(0).current

  const username$ = useObservable('')
  const password$ = useObservable('')
  const usernameError$ = useObservable('')
  const passwordError$ = useObservable('')
  const didSave$ = useObservable(false)
  const successMessage$ = useObservable('')

  useObserve(() => {
    if (didSave$.get()) {
      usernameError$.set(username$.get().length < 3 ?
        'Username must be > 3 characters' :
        ''
      )
      const pass = password$.get()
      passwordError$.set(
        pass.length < 10 ?
          'Password must be > 10 characters' :
          !pass.match(/d/) ?
            'Password must include a number' :
            ''
      )
    }
  })

  const onClickSave = () => {
    // setting triggers useObserve, updating error messages
    didSave$.set(true)

    if (!usernameError$.get() && !passwordError$.get()) {
      console.log('Submit form')
      passwordError$.delete()
      successMessage$.set('Saved!')
    }
  }

  return (
    <Box>
      <div>Renders: {renderCount}</div>
      <div>Username:</div>
      <Reactive.input
        className="input"
        $value={username$}
      />
      <div className="error">
        <Memo>{usernameError$}</Memo>
      </div>
      <div>Password:</div>
      <Reactive.input
        type="password"
        className="input"
        $value={password$}
      />
      <div className="error">
        <Memo>{passwordError$}</Memo>
      </div>
      <Show if={successMessage$}>
        {() => (
          <div>
            {successMessage$.get()}
          </div>
        )}
      </Show>
      <Button onClick={onClickSave}>
        Save
      </Button>
    </Box>
  )
}
`;function w(){return s.jsx(c,{code:p,scope:{useRef:m.useRef,enableReactComponents:u,Reactive:r,useObservable:a,useObserve:o,Memo:t,Show:n,Box:i,Button:d},noInline:!0,previewWidth:200,renderCode:";render(<App />)",transformCode:e=>e.replace(/className="input"/g,'className="bg-gray-900 text-white border rounded border-gray-600 px-2 py-1 mt-2"').replace(/className="error"/g,'className="text-sm text-red-500 mb-2 h-10 pt-1"')})}export{w as FormValidationComponent};
