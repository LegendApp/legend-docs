import{j as e,u as o,M as r,g as s}from"./index.BSHcnaqT.js";import{B as t}from"./Box.RILDG8lM.js";import{B as u}from"./Button.ClJkF7xk.js";import{E as a}from"./Editor.C2n4p8Q8.js";import"./index.SSXOyoI7.js";import{u as n}from"./useIsomorphicLayoutEffect.CrH7GU3n.js";const i=`
import { useInterval } from "usehooks-ts"
import { Memo, usePauseProvider, useObservable } from '@legendapp/state/react'

function App() {
    const { PauseProvider, isPaused$ } = usePauseProvider()

    const int$ = useObservable(0)
    useInterval(() => {
        int$.set((val) => val + 1)
    }, 100)

    return (
        <Box center>
            <Button onClick={isPaused$.toggle}>
                <Memo>{() => (isPaused$.get() ? 'Resume' : 'Pause')}</Memo>
            </Button>
            <PauseProvider>
                <Memo>{int$}</Memo>
            </PauseProvider>
        </Box>
    )
}
`;function c(){return e.jsx(a,{code:i,scope:{Box:t,useObservable:o,Memo:r,useInterval:n,Button:u,usePauseProvider:s},noInline:!0,previewWidth:140,renderCode:";render(<App />)"})}export{c as PauseExampleComponent};
