(function(o,f){typeof exports=="object"&&typeof module<"u"?module.exports=f():typeof define=="function"&&define.amd?define(f):(o=typeof globalThis<"u"?globalThis:o||self,o.spicyJS=f())})(this,function(){"use strict";const o=(t,e)=>{if(e instanceof HTMLElement||e instanceof Text)t.append(e);else if(e instanceof Array)t.append(...e);else if(typeof e=="string"||typeof e=="number")t.append(e.toString());else if(typeof e=="object"&&e!=null){const i=e;for(const s of Object.keys(i)){const n=i[s];typeof n=="function"?t.addEventListener(s,n):typeof n=="object"&&"handler"in n?t.addEventListener(s,n.handler,n.options):s in t?s==="style"?Object.assign(t.style,n):t[s]=n:t.setAttribute(s,String(n))}}};function f(t,...e){for(const i of e)o(t,i);return t}const c=(t,...e)=>{const i=document.createElement(t);return f(i,...e)},r=t=>(...e)=>c(t,...e);function a(t,...e){return typeof t=="string"?c(t,...e):f(t,...e)}return new Proxy(a,{get:(t,e)=>r(e),apply(t,e,i){return t.apply(e,i)}})});
