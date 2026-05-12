(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{107:(e,t,r)=>{"use strict";r.d(t,{J:()=>s});var a=r(9339);let s=(0,a.createServerReference)("40f8dfd608f07f204543b42cc25e938c46fe5330d9",a.callServer,void 0,a.findSourceMapURL,"signIn")},1337:(e,t,r)=>{"use strict";r.d(t,{cn:()=>i});var a=r(9722),s=r(5806);function i(...e){return(0,s.Q)((0,a.$)(e))}},4474:(e,t,r)=>{"use strict";r.d(t,{$:()=>l});var a=r(5155);r(2115);var s=r(8460),i=r(2442),o=r(1337);let n=(0,s.F)("group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",{variants:{variant:{default:"bg-primary text-primary-foreground [a]:hover:bg-primary/80",outline:"border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",ghost:"hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",destructive:"bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",xs:"h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",sm:"h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",lg:"h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",icon:"size-8","icon-xs":"size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3","icon-sm":"size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg","icon-lg":"size-9"}},defaultVariants:{variant:"default",size:"default"}});function l({className:e,variant:t="default",size:r="default",asChild:s=!1,...d}){let c=s?i.bL:"button";return(0,a.jsx)(c,{"data-slot":"button","data-variant":t,"data-size":r,className:(0,o.cn)(n({variant:t,size:r,className:e})),...d})}},6290:(e,t,r)=>{"use strict";r.d(t,{ConsultationDashboard:()=>p});var a=r(5155),s=r(2115),i=r(8434),o=r(9339);let n=(0,o.createServerReference)("60debff61941e6e69faacf82f902d2ca986d93aff3",o.callServer,void 0,o.findSourceMapURL,"createConsultation");var l=r(4474);function d({session:e}){let t=async t=>n(t,e.user.id),[r,o]=(0,s.useState)(null),[c,u]=(0,s.useState)(!1),[p,m]=(0,s.useTransition)();return(0,s.useEffect)(()=>{r&&(i.oR.error(r),o(null)),c&&(i.oR.success("Consultation request submitted."),u(!1))},[r,c]),(0,a.jsxs)("div",{className:"space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-card dark:border-slate-800 dark:bg-slate-950",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("h2",{className:"text-2xl font-semibold text-slate-950 dark:text-slate-50",children:"Start your consultation"}),(0,a.jsx)("p",{className:"mt-2 text-slate-600 dark:text-slate-300",children:"Share your skin concern and our AI-assisted workflow will prepare the report securely."})]}),(0,a.jsxs)("form",{onSubmit:e=>{e.preventDefault();let r=new FormData(e.currentTarget);m(async()=>{try{(await t(r)).success?u(!0):o("Failed to submit consultation.")}catch(e){o(e instanceof Error?e.message:"Failed to submit consultation.")}})},className:"space-y-4",children:[(0,a.jsxs)("div",{className:"grid gap-2",children:[(0,a.jsx)("label",{className:"text-sm font-medium text-slate-700 dark:text-slate-300",children:"Skin concern"}),(0,a.jsx)("input",{name:"skin_concern",required:!0,className:"rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-slate-500 dark:focus:ring-slate-800",placeholder:"E.g. acne, redness, texture"})]}),(0,a.jsxs)("div",{className:"grid gap-2",children:[(0,a.jsx)("label",{className:"text-sm font-medium text-slate-700 dark:text-slate-300",children:"Detailed description"}),(0,a.jsx)("textarea",{name:"description",rows:6,required:!0,className:"rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-slate-500 dark:focus:ring-slate-800",placeholder:"Describe your current regimen, symptoms, and previous treatments."})]}),(0,a.jsx)(l.$,{type:"submit",disabled:p,className:"w-full",children:p?"Submitting…":"Submit consultation"})]})]})}var c=r(107);function u(){let[e,t]=(0,s.useState)(null),[r,o]=(0,s.useState)(!1),[n,d]=(0,s.useTransition)();return(0,s.useEffect)(()=>{e&&(i.oR.error(e),t(null)),r&&(i.oR.success("Signed in successfully."),o(!1))},[e,r]),(0,a.jsxs)("div",{className:"space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("h2",{className:"text-2xl font-semibold text-slate-950 dark:text-slate-50",children:"Secure sign in"}),(0,a.jsx)("p",{className:"mt-2 text-slate-600 dark:text-slate-300",children:"Authenticate with email and password to start your skin consultation."})]}),(0,a.jsxs)("form",{onSubmit:e=>{e.preventDefault();let r=new FormData(e.currentTarget);d(async()=>{try{(await (0,c.J)(r)).success?o(!0):t("Unable to sign in.")}catch(e){t(e instanceof Error?e.message:"Unable to sign in.")}})},className:"space-y-4",children:[(0,a.jsxs)("div",{className:"grid gap-2",children:[(0,a.jsx)("label",{className:"text-sm font-medium text-slate-700 dark:text-slate-300",children:"Email"}),(0,a.jsx)("input",{name:"email",type:"email",required:!0,className:"rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-slate-500 dark:focus:ring-slate-800"})]}),(0,a.jsxs)("div",{className:"grid gap-2",children:[(0,a.jsx)("label",{className:"text-sm font-medium text-slate-700 dark:text-slate-300",children:"Password"}),(0,a.jsx)("input",{name:"password",type:"password",required:!0,minLength:8,className:"rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-slate-500 dark:focus:ring-slate-800"})]}),(0,a.jsx)(l.$,{type:"submit",disabled:n,className:"w-full",children:n?"Signing in…":"Sign in"})]})]})}function p({session:e}){return(0,a.jsx)("div",{className:"space-y-6",children:e?(0,a.jsxs)("div",{className:"rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-card dark:border-slate-800 dark:bg-slate-950",children:[(0,a.jsxs)("p",{className:"text-sm text-slate-500 dark:text-slate-400",children:["Signed in as ",e.user.email]}),(0,a.jsx)(d,{session:e})]}):(0,a.jsx)(u,{})})}},6423:(e,t,r)=>{Promise.resolve().then(r.bind(r,6290))},8434:(e,t,r)=>{"use strict";let a,s;r.d(t,{l$:()=>ee,oR:()=>R});var i,o=r(2115);let n={data:""},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,c=/\n+/g,u=(e,t)=>{let r="",a="",s="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?r=i+" "+o+";":a+="f"==i[1]?u(o,i):i+"{"+u(o,"k"==i[1]?"":t)+"}":"object"==typeof o?a+=u(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=u.p?u.p(i,o):i+":"+o+";")}return r+(t&&s?t+"{"+s+"}":s)+a},p={},m=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+m(e[r]);return t}return e};function f(e){let t,r,a=this||{},s=e.call?e(a.p):e;return((e,t,r,a,s)=>{var i;let o=m(e),n=p[o]||(p[o]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(o));if(!p[n]){let t=o!==e?e:(e=>{let t,r,a=[{}];for(;t=l.exec(e.replace(d,""));)t[4]?a.shift():t[3]?(r=t[3].replace(c," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(c," ").trim();return a[0]})(e);p[n]=u(s?{["@keyframes "+n]:t}:t,r?"":"."+n)}let f=r&&p.g?p.g:null;return r&&(p.g=p[n]),i=p[n],f?t.data=t.data.replace(f,i):-1===t.data.indexOf(i)&&(t.data=a?i+t.data:t.data+i),n})(s.unshift?s.raw?(t=[].slice.call(arguments,1),r=a.p,s.reduce((e,a,s)=>{let i=t[s];if(i&&i.call){let e=i(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(a.target),a.g,a.o,a.k)}f.bind({g:1});let g,b,x,h=f.bind({k:1});function v(e,t){let r=this||{};return function(){let a=arguments;function s(i,o){let n=Object.assign({},i),l=n.className||s.className;r.p=Object.assign({theme:b&&b()},n),r.o=/ *go\d+/.test(l),n.className=f.apply(r,a)+(l?" "+l:""),t&&(n.ref=o);let d=e;return e[0]&&(d=n.as||e,delete n.as),x&&d[0]&&x(n),g(d,n)}return t?t(s):s}}var y=(e,t)=>"function"==typeof e?e(t):e,k=(a=0,()=>(++a).toString()),w=()=>{if(void 0===s&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");s=!e||e.matches}return s},j="default",N=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return N(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},E=[],S={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},z={},$=(e,t=j)=>{z[t]=N(z[t]||S,e),E.forEach(([e,r])=>{e===t&&r(z[t])})},_=e=>Object.keys(z).forEach(t=>$(e,t)),D=(e=j)=>t=>{$(t,e)},C={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},O=e=>(t,r)=>{let a,s=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||k()}))(t,e,r);return D(s.toasterId||(a=s.id,Object.keys(z).find(e=>z[e].toasts.some(e=>e.id===a))))({type:2,toast:s}),s.id},R=(e,t)=>O("blank")(e,t);R.error=O("error"),R.success=O("success"),R.loading=O("loading"),R.custom=O("custom"),R.dismiss=(e,t)=>{let r={type:3,toastId:e};t?D(t)(r):_(r)},R.dismissAll=e=>R.dismiss(void 0,e),R.remove=(e,t)=>{let r={type:4,toastId:e};t?D(t)(r):_(r)},R.removeAll=e=>R.remove(void 0,e),R.promise=(e,t,r)=>{let a=R.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?y(t.success,e):void 0;return s?R.success(s,{id:a,...r,...null==r?void 0:r.success}):R.dismiss(a),e}).catch(e=>{let s=t.error?y(t.error,e):void 0;s?R.error(s,{id:a,...r,...null==r?void 0:r.error}):R.dismiss(a)}),e};var A=1e3,I=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,L=h`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,P=h`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,M=v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${I} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${L} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${P} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,F=h`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,T=v("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${F} 1s linear infinite;
`,U=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,q=h`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,H=v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${U} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${q} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,J=v("div")`
  position: absolute;
`,B=v("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Q=h`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,V=v("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Q} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Y=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?o.createElement(V,null,t):t:"blank"===r?null:o.createElement(B,null,o.createElement(T,{...a}),"loading"!==r&&o.createElement(J,null,"error"===r?o.createElement(M,{...a}):o.createElement(H,{...a})))},Z=v("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,G=v("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,K=o.memo(({toast:e,position:t,style:r,children:a})=>{let s=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[a,s]=w()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${h(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${h(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=o.createElement(Y,{toast:e}),n=o.createElement(G,{...e.ariaProps},y(e.message,e));return o.createElement(Z,{className:e.className,style:{...s,...r,...e.style}},"function"==typeof a?a({icon:i,message:n}):o.createElement(o.Fragment,null,i,n))});i=o.createElement,u.p=void 0,g=i,b=void 0,x=void 0;var W=({id:e,className:t,style:r,onHeightUpdate:a,children:s})=>{let i=o.useCallback(t=>{if(t){let r=()=>{a(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return o.createElement("div",{ref:i,className:t,style:r},s)},X=f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:a,children:s,toasterId:i,containerStyle:n,containerClassName:l})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:r,pausedAt:a}=((e={},t=j)=>{let[r,a]=(0,o.useState)(z[t]||S),s=(0,o.useRef)(z[t]);(0,o.useEffect)(()=>(s.current!==z[t]&&a(z[t]),E.push([t,a]),()=>{let e=E.findIndex(([e])=>e===t);e>-1&&E.splice(e,1)}),[t]);let i=r.toasts.map(t=>{var r,a,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||C[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...r,toasts:i}})(e,t),s=(0,o.useRef)(new Map).current,i=(0,o.useCallback)((e,t=A)=>{if(s.has(e))return;let r=setTimeout(()=>{s.delete(e),n({type:4,toastId:e})},t);s.set(e,r)},[]);(0,o.useEffect)(()=>{if(a)return;let e=Date.now(),s=r.map(r=>{if(r.duration===1/0)return;let a=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(a<0){r.visible&&R.dismiss(r.id);return}return setTimeout(()=>R.dismiss(r.id,t),a)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[r,a,t]);let n=(0,o.useCallback)(D(t),[t]),l=(0,o.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),d=(0,o.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),c=(0,o.useCallback)(()=>{a&&n({type:6,time:Date.now()})},[a,n]),u=(0,o.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:s=8,defaultPosition:i}=t||{},o=r.filter(t=>(t.position||i)===(e.position||i)&&t.height),n=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...a?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+s,0)},[r]);return(0,o.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=s.get(e.id);t&&(clearTimeout(t),s.delete(e.id))}})},[r,i]),{toasts:r,handlers:{updateHeight:d,startPause:l,endPause:c,calculateOffset:u}}})(r,i);return o.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(r=>{let i,n,l=r.position||t,d=c.calculateOffset(r,{reverseOrder:e,gutter:a,defaultPosition:t}),u=(i=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:w()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...n});return o.createElement(W,{id:r.id,key:r.id,onHeightUpdate:c.updateHeight,className:r.visible?X:"",style:u},"custom"===r.type?y(r.message,r):s?s(r):o.createElement(K,{toast:r,position:l}))}))}},9339:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a={callServer:function(){return i.callServer},createServerReference:function(){return n.createServerReference},findSourceMapURL:function(){return o.findSourceMapURL}};for(var s in a)Object.defineProperty(t,s,{enumerable:!0,get:a[s]});let i=r(7304),o=r(4060),n=r(7197)}},e=>{e.O(0,[594,441,794,358],()=>e(e.s=6423)),_N_E=e.O()}]);