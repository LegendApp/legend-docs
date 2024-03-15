import{o as q,m as ge,n as ue,p as I,i as ee,w as W,q as D,v as te,x,s as ne,y as he,z as ie,A as J,e as O,B as oe,D as K,E as se,G as ae}from"./index.BSHcnaqT.js";const A={};function Pe(e){Object.assign(A,e)}function ce(e,t,n){const i={};let o=i;for(let s=0;s<e.length;s++)o=o[e[s]]=s===e.length-1?null:t[s]==="array"?[]:{};let a=j(i,n);const c=[];for(let s=0;s<e.length;s++){const l=Object.keys(a)[0];c.push(l),a=a[l]}return c}function j(e,t){let n=e;if(e){if(e===he)return e;if(ie(e))return t[e];n={};const i=Object.keys(t).length===1&&t._dict;for(const o in e){let a=e[o];if(i)n[o]=j(a,i);else{const c=t[o];if(c===void 0)o!=="@"&&(n[o]=a);else if(c!==null){if(a!=null){if(t[o+"_val"]){const s=t[o+"_val"];J(a)?a=a.map(l=>s[l]):a=s[a]}else if(t[o+"_arr"]&&J(a)){const s=t[o+"_arr"];a=a.map(l=>j(l,s))}else if(ee(a)){if(t[o+"_obj"])a=j(a,t[o+"_obj"]);else if(t[o+"_dict"]){const s=t[o+"_dict"],l={};for(const g in a)l[g]=j(a[g],s);a=l}}}n[c]=a}}}}return n}function pe(e,t,n,i){const o=se(t,n,e),a=j(o,i),c=ce(t,n,i);return{path:c,obj:ae(c,n,a)}}const X=new WeakMap;function B(e){const t=X.get(e);if(t)return t;const n={};for(const i in e){const o=e[i];if(i==="_dict")n[i]=B(o);else if(i.endsWith("_obj")||i.endsWith("_dict")||i.endsWith("_arr")||i.endsWith("_val")){const a=e[i.replace(/_obj|_dict|_arr|_val$/,"")],c=i.match(/_obj|_dict|_arr|_val$/)[0];n[a+c]=B(o)}else typeof o=="string"&&(n[o]=i)}return X.set(e,n),n}function ve({get:e,set:t}){const n={};return e&&(n.get=async i=>{const o=await e(i);i.onChange({value:o,dateModified:Date.now()}),i.onGet()}),t&&(n.set=t),n}const z=new WeakMap,N=q({inRemoteSync:!1}),F=new WeakMap,U=new Set;function T(e){return e?ie(e)?{table:e,config:{name:e}}:{table:e.name,config:e}:{}}function $(e,t){return D(e)?e.then(t):t(e)}function Y(e,t,n,{transform:i,fieldTransforms:o}){if(o||i?.out){const a=()=>{if(o){const{obj:c,path:s}=pe(e,t,n,o);e=c,t=s}return{value:e,path:t}};if(i?.out){const c=se(t,n,e),s=i.out(c);return $(s,g=>(e=ae(t,n,g),a()))}return a()}return{value:e,path:t}}function V(e,{transform:t,fieldTransforms:n},i){if(n){const o=B(n);e=j(e,o)}return i&&t?.in&&(e=t.in(e)),e}async function le(e,t,n,i,o){const a=Array.from(U);a.length>0&&await Promise.all(a);const{persistenceLocal:c}=t,s=i.local,{table:l,config:g}=T(s),v=F.get(e),{modified:r,pending:P}=o;if(P||r&&(!v||r!==v.modified)){const u=Object.assign({},v,o);F.set(e,u),c&&await c.setMetadata(l,u,g),r&&n.dateModified.set(r)}}function de(e,t,n,i,o){t.timeoutSaveMetadata&&clearTimeout(t.timeoutSaveMetadata),t.timeoutSaveMetadata=setTimeout(()=>le(e,t,n,i,o),30)}let G=[];async function me(){const e=G;G=[],(await Promise.all(e.map(be))).forEach(Le)}async function be(e){const{syncState:t,changes:n,localState:i,persistOptions:o,inRemoteChange:a,isApplyingPending:c}=e,s=o.local,{persistenceRemote:l}=i,{config:g}=T(s),v=o.remote,r=s&&!g.readonly&&!c&&t.isEnabledLocal.peek(),P=!a&&l&&!v?.readonly&&t.isEnabledRemote.peek();if(r||P){if(r&&!t.isLoadedLocal.peek()){console.error("[legend-state] WARNING: An observable was changed before being loaded from persistence",s);return}const M=[],u=[],f=new Set;let h=[];for(let d=n.length-1;d>=0;d--){const{path:m}=n[d];let y=!1;if(f.size>0){for(let p=0;p<m.length;p++)if(f.has((p===m.length-1?m:m.slice(0,p+1)).join("/"))){y=!0;break}}if(!y){const p=m.join("/");f.add(p);const{prevAtPath:b,valueAtPath:L,pathTypes:w}=n[d];if(r){const _=Y(L,m,w,g);h.push($(_,({path:S,value:C})=>{S.includes(void 0)||M.push({path:S,pathTypes:w,prevAtPath:b,valueAtPath:C,pathStr:p})}))}if(P){const _=Y(L,m,w,v||{});h.push($(_,({path:S,value:C})=>{var R;if(!S.includes(void 0)){i.pendingChanges||(i.pendingChanges={});let E=!1;for(let k=0;!E&&k<m.length-1;k++){const H=m.slice(0,k+1).join("/");if(!((R=i.pendingChanges[H])===null||R===void 0)&&R.v){E=!0;const re=m.slice(k+1),fe=w.slice(k+1);ne(i.pendingChanges[H].v,re,fe,L)}}if(!E){for(const k in i.pendingChanges)k!==p&&k.startsWith(p)&&delete i.pendingChanges[k];i.pendingChanges[p]||(i.pendingChanges[p]={p:b??null,t:w}),i.pendingChanges[p].v=L}u.push({path:S,pathTypes:w,prevAtPath:b,valueAtPath:C,pathStr:p})}}))}}}return h=h.filter(Boolean),h.length>0&&await Promise.all(h),{queuedChange:e,changesLocal:M,changesRemote:u}}}async function Le(e){var t,n,i,o;if(!e)return;const{queuedChange:a,changesLocal:c,changesRemote:s}=e,{obs:l,syncState:g,localState:v,persistOptions:r}=a,{persistenceLocal:P,persistenceRemote:M}=v,u=r.local,{table:f,config:h}=T(u),d=r.remote,m=u&&d?.offlineBehavior==="retry";if(s.length>0&&m&&await le(l,v,g,r,{pending:v.pendingChanges}),c.length>0){let y=P.set(f,c,h);y&&(y=y.then(()=>{U.delete(y)}),U.add(y),await y)}if(s.length>0){await W(()=>g.isLoaded.get()||d?.allowSetIfError&&g.error.get());const y=l.peek();(t=d?.onBeforeSet)===null||t===void 0||t.call(d);const p=await((n=M.set({obs:l,syncState:g,options:r,changes:s,value:y}))===null||n===void 0?void 0:n.catch(b=>{var L;return(L=d?.onSetError)===null||L===void 0?void 0:L.call(d,b)}));if(p){const b=Array.from(new Set(s.map(_=>_.pathStr))),{changes:L,dateModified:w}=p;if(b.length>0){if(u){const _={},S=(i=P.getMetadata(f,h))===null||i===void 0?void 0:i.pending;let C=[];for(let R=0;R<b.length;R++){const E=b[R];S?.[E]&&(delete S[E],_.pending=S)}w&&(_.modified=w),L&&!x(L)&&C.push(V(L,r.remote,!1)),C.length>0&&(C.some(R=>D(R))&&(C=await Promise.all(C)),Q(()=>oe(l,...C))),m&&!x(_)&&de(l,v,g,r,_)}(o=d?.onSet)===null||o===void 0||o.call(d)}}}}function Z(e,t,n,i,{changes:o}){if(!O.globalState.isLoadingLocal){const a=O.globalState.isLoadingRemote,c=n.isApplyingPending;G.push({obs:e,syncState:t,localState:n,persistOptions:i,changes:o,inRemoteChange:a,isApplyingPending:c}),G.length===1&&queueMicrotask(me)}}function Q(e){W(()=>!N.inRemoteSync.get(),()=>{N.inRemoteSync.set(!0),O.globalState.isLoadingRemote=!0,te(e,()=>{O.globalState.isLoadingRemote=!1,N.inRemoteSync.set(!1)})})}async function ye(e,t,n,i){var o;const{local:a}=t,c=t.pluginLocal||A.pluginLocal;if(a){const{table:s,config:l}=T(a);if(!c)throw new Error("Local persistence is not configured");if(!z.has(c)){const u=new c,f={persist:u,initialized:q(!1)};if(z.set(c,f),u.initialize){const h=(o=u.initialize)===null||o===void 0?void 0:o.call(u,A.localOptions||{});D(h)&&await h}f.initialized.set(!0)}const{persist:g,initialized:v}=z.get(c);if(i.persistenceLocal=g,v.get()||await W(v),g.loadTable){const u=g.loadTable(s,l);u&&await u}let r=g.getTable(s,l);const P=g.getMetadata(s,l);if(P&&(F.set(e,P),i.pendingChanges=P.pending,n.dateModified.set(P.modified)),r!=null){const{transform:u,fieldTransforms:f}=l;r=V(r,{transform:u,fieldTransforms:f},!0),D(r)&&(r=await r),te(()=>{O.globalState.isLoadingLocal=!0,oe(e,r)},()=>{O.globalState.isLoadingLocal=!1})}const M=I(e);M.state.peek().clearLocal=()=>Promise.all([g.deleteTable(s,l),g.deleteMetadata(s,l)])}n.isLoadedLocal.set(!0)}function we(e,t){const n=ge(e)?e:q(ue(e)?e():e),i=I(n);t.remote&&(t.remote=Object.assign({},A.remoteOptions,t.remote));let{remote:o}=t;const{local:a}=t,c=t.pluginRemote||A?.pluginRemote,s={},l=i.state=q({isLoadedLocal:!1,isLoaded:!1,isEnabledLocal:!0,isEnabledRemote:!0,clearLocal:void 0,sync:()=>Promise.resolve(),getPendingChanges:()=>s.pendingChanges});if(ye(n,t,l,s),o||c){if(!c)throw new Error("Remote persistence is not configured");o||(o={}),ee(c)?s.persistenceRemote=ve(c):(z.has(c)||z.set(c,{persist:new c}),s.persistenceRemote=z.get(c).persist);let g=!1;const v=async()=>{var r;if(!g){g=!0;const P=(r=F.get(n))===null||r===void 0?void 0:r.modified,M=s.persistenceRemote.get;M?M({state:l,obs:n,options:t,dateModified:P,onGet:()=>{l.isLoaded.set(!0)},onChange:async({value:f,path:h=[],pathTypes:d=[],mode:m="set",dateModified:y})=>{if(f!==void 0){f=V(f,o,!0),D(f)&&(f=await f);const p=o.fieldTransforms&&B(o.fieldTransforms);if(h.length&&p&&(h=ce(h,d,p)),m==="dateModified")y&&!x(f)&&Q(()=>{K(n,h,d,f,"assign")});else{const b=s.pendingChanges;b&&Object.keys(b).forEach(L=>{const w=L.split("/").filter(C=>C!==""),{v:_,t:S}=b[L];f[w[0]]!==void 0&&(f=ne(f,w,S,_,n.peek(),(C,R)=>{delete b[L],b[C.join("/")]={p:null,v:R,t:S.slice(0,C.length)}}))}),Q(()=>{K(n,h,d,f,m)})}}y&&a&&de(n,s,l,t,{modified:y})}}):l.isLoaded.set(!0),await W(()=>l.isLoaded.get()||o.allowSetIfError&&l.error.get());const u=s.pendingChanges;if(u&&!x(u)){s.isApplyingPending=!0;const f=Object.keys(u),h=[];for(let d=0;d<f.length;d++){const m=f[d],y=m.split("/").filter(w=>w!==""),{p,v:b,t:L}=u[m];h.push({path:y,valueAtPath:b,prevAtPath:p,pathTypes:L})}Z(n,l,s,t,{value:n.peek(),getPrevious:()=>{},changes:h}),s.isApplyingPending=!1}}};o.manual?l.assign({sync:v}):W(()=>!a||l.isLoadedLocal.get(),v)}return W(!a||l.isLoadedLocal,function(){n.onChange(Z.bind(this,n,l,s,t))}),n}export{Pe as c,we as p};