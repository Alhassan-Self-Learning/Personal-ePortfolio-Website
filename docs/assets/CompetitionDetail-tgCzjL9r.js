import{l as c,j as e,A as l}from"./index-DJciDSua.js";import{P as r,D as i,C as d,B as m}from"./primitives-CGz6uSug.js";import"./react-DkCSZi3y.js";/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=c("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=c("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);function u({entry:s}){var a,t;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"reveal grid gap-3 sm:grid-cols-2",children:[e.jsxs("div",{className:"flex gap-3 bg-surface p-6",children:[e.jsx(l,{size:22,"aria-hidden":"true",className:s.result?"text-cat-competitions":"text-muted"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-muted",children:"Result"}),e.jsx("p",{className:"text-xl font-medium",children:s.result??"Participated"})]})]}),e.jsxs("div",{className:"flex gap-3 bg-surface p-6",children:[s.participation==="team"?e.jsx(h,{size:22,"aria-hidden":"true",className:"text-muted"}):e.jsx(x,{size:22,"aria-hidden":"true",className:"text-muted"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-muted",children:s.participation==="team"?"Team":"Participation"}),e.jsx("p",{className:"text-xl font-medium",children:s.participation==="team"?s.teamName??"Team entry":"Individual"})]})]})]}),s.description&&e.jsx(r,{text:s.description}),!!((a=s.challengeCategories)!=null&&a.length)&&e.jsx(i,{title:"Challenge categories",children:e.jsx(d,{items:s.challengeCategories})}),!!((t=s.highlights)!=null&&t.length)&&e.jsx(i,{title:"What I worked on",children:e.jsx(m,{items:s.highlights})})]})}export{u as default};
