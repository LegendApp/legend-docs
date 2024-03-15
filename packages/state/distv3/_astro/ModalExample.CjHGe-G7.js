import{j as S,o as I,r as z,u as O,S as F,l as T,k as j}from"./index.BSHcnaqT.js";import{B as L}from"./Box.RILDG8lM.js";import{B as D}from"./Button.ClJkF7xk.js";import{r as e}from"./index.SSXOyoI7.js";import{E as U}from"./Editor.C2n4p8Q8.js";import{b as M,f as A,u as K,P as W,L as Y,m as _}from"./motion.CuwXudW8.js";function b(){const n=e.useRef(!1);return M(()=>(n.current=!0,()=>{n.current=!1}),[]),n}function G(){const n=b(),[r,t]=e.useState(0),o=e.useCallback(()=>{n.current&&t(r+1)},[r]);return[e.useCallback(()=>A.postRender(o),[o]),r]}class H extends e.Component{getSnapshotBeforeUpdate(r){const t=this.props.childRef.current;if(t&&r.isPresent&&!this.props.isPresent){const o=this.props.sizeRef.current;o.height=t.offsetHeight||0,o.width=t.offsetWidth||0,o.top=t.offsetTop,o.left=t.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function V({children:n,isPresent:r}){const t=e.useId(),o=e.useRef(null),p=e.useRef({width:0,height:0,top:0,left:0});return e.useInsertionEffect(()=>{const{width:f,height:d,top:u,left:h}=p.current;if(r||!o.current||!f||!d)return;o.current.dataset.motionPopId=t;const l=document.createElement("style");return document.head.appendChild(l),l.sheet&&l.sheet.insertRule(`
          [data-motion-pop-id="${t}"] {
            position: absolute !important;
            width: ${f}px !important;
            height: ${d}px !important;
            top: ${u}px !important;
            left: ${h}px !important;
          }
        `),()=>{document.head.removeChild(l)}},[r]),e.createElement(H,{isPresent:r,childRef:o,sizeRef:p},e.cloneElement(n,{ref:o}))}const w=({children:n,initial:r,isPresent:t,onExitComplete:o,custom:p,presenceAffectsLayout:f,mode:d})=>{const u=K(q),h=e.useId(),l=e.useMemo(()=>({id:h,initial:r,isPresent:t,custom:p,onExitComplete:s=>{u.set(s,!0);for(const a of u.values())if(!a)return;o&&o()},register:s=>(u.set(s,!1),()=>u.delete(s))}),f?void 0:[t]);return e.useMemo(()=>{u.forEach((s,a)=>u.set(a,!1))},[t]),e.useEffect(()=>{!t&&!u.size&&o&&o()},[t]),d==="popLayout"&&(n=e.createElement(V,{isPresent:t},n)),e.createElement(W.Provider,{value:l},n)};function q(){return new Map}function J(n){return e.useEffect(()=>()=>n(),[])}const m=n=>n.key||"";function Q(n,r){n.forEach(t=>{const o=m(t);r.set(o,t)})}function X(n){const r=[];return e.Children.forEach(n,t=>{e.isValidElement(t)&&r.push(t)}),r}const Z=({children:n,custom:r,initial:t=!0,onExitComplete:o,exitBeforeEnter:p,presenceAffectsLayout:f=!0,mode:d="sync"})=>{const u=e.useContext(Y).forceRender||G()[0],h=b(),l=X(n);let s=l;const a=e.useRef(new Map).current,g=e.useRef(s),v=e.useRef(new Map).current,C=e.useRef(!0);if(M(()=>{C.current=!1,Q(l,v),g.current=s}),J(()=>{C.current=!0,v.clear(),a.clear()}),C.current)return e.createElement(e.Fragment,null,s.map(i=>e.createElement(w,{key:m(i),isPresent:!0,initial:t?void 0:!1,presenceAffectsLayout:f,mode:d},i)));s=[...s];const y=g.current.map(m),E=l.map(m),B=y.length;for(let i=0;i<B;i++){const c=y[i];E.indexOf(c)===-1&&!a.has(c)&&a.set(c,void 0)}return d==="wait"&&a.size&&(s=[]),a.forEach((i,c)=>{if(E.indexOf(c)!==-1)return;const R=v.get(c);if(!R)return;const N=y.indexOf(c);let x=i;if(!x){const $=()=>{v.delete(c),a.delete(c);const P=g.current.findIndex(k=>k.key===c);if(g.current.splice(P,1),!a.size){if(g.current=l,h.current===!1)return;u(),o&&o()}};x=e.createElement(w,{key:m(R),isPresent:!1,onExitComplete:$,custom:r,presenceAffectsLayout:f,mode:d},R),a.set(c,x)}s.splice(N,0,x)}),s=s.map(i=>{const c=i.key;return a.has(c)?i:e.createElement(w,{key:m(i),isPresent:!0,presenceAffectsLayout:f,mode:d},i)}),e.createElement(e.Fragment,null,a.size?s:s.map(i=>e.cloneElement(i)))},ee=`
const MotionDiv = reactive(motion.div)
const MotionButton = reactive(motion.button)

const TransitionBounce = {
  type: 'spring',
  duration: 0.4,
  bounce: 0.3,
}

function Modal({ show }) {
  const renderCount = ++useRef(0).current
  const page$ = useObservable(0)

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => show.set(false)}
      />
      <motion.div
        className="modal"
        initial={{ opacity: 0, scale: 0.7, translateY: 40 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        exit={{ scale: 0.7, opacity: 0 }}
        style={{ width: 240, height: 320 }}
        transition={TransitionBounce}
      >
        <div>
          Renders: {renderCount}
        </div>
        <div className="pageText">
          <Switch value={page$}>
            {{
              0: () => <div>First Page</div>,
              1: () => <div>Second Page</div>,
              2: () => <div>Third Page</div>
            }}
          </Switch>
        </div>
        <div className="modalButtons">
          <MotionButton
            className="pageButton"
            animate={() => ({ opacity: page$.get() === 0 ? 0.5 : 1 })}
            $disabled={() => page$.get() === 0}
            onClick={() => page$.set(p => p - 1)}
            transition={{ duration: 0.15 }}
          >
            Prev
          </MotionButton>
          <MotionButton
            className="pageButton"
            animate={() => ({ opacity: page$.get() === 2 ? 0.5 : 1 })}
            $disabled={() => page$.get() === 2}
            onClick={() => page$.set(p => p + 1)}
            transition={{ duration: 0.15 }}
          >
            Next
          </MotionButton>
        </div>
      </motion.div>
    </motion.div>
  )
}


function App() {
  const renderCount = ++useRef(0).current

  const showModal = useObservable(false)

  return (
    <Box height={512}>
      <div>Renders: {renderCount}</div>
      <Button onClick={showModal.toggle}>
        Show modal
      </Button>
      <Show if={showModal} wrap={AnimatePresence}>
        {() => <Modal show={showModal} />}
      </Show>
    </Box>
  )
}
`;function ae(){return S.jsx(U,{code:ee,scope:{useRef:e.useRef,observable:I,reactive:z,motion:_,useObservable:O,Show:F,AnimatePresence:Z,Switch:T,useComputed:j,Box:L,Button:D},noInline:!0,renderCode:";render(<App />)",previewWidth:220,transformCode:n=>n.replace(/className="pageText"/g,'className="flex-1 flex justify-center items-center"').replace(/className="pageButton"/g,'className="px-4 py-2 my-4 font-bold rounded shadow text-2xs cursor-pointer bg-gray-600 hover:bg-gray-500 !mt-0"').replace(/className="modal"/g,'className="relative bg-gray-700 rounded-xl flex flex-col p-4"').replace(/className="modalButtons"/g,'className="flex justify-center gap-4"')})}export{ae as ModalComponent};
