const a = (t, e) => {
  if (e instanceof HTMLElement || e instanceof Text)
    t.append(e);
  else if (e instanceof Array)
    t.append(...e);
  else if (typeof e == "string" || typeof e == "number")
    t.append(e.toString());
  else if (typeof e == "object" && e != null) {
    const s = e;
    for (const i of Object.keys(s)) {
      const n = s[i];
      typeof n == "function" ? t.addEventListener(i, n) : typeof n == "object" && "handler" in n ? t.addEventListener(i, n.handler, n.options) : i in t ? i === "style" ? Object.assign(t.style, n) : t[i] = n : t.setAttribute(i, String(n));
    }
  }
};
function c(t, ...e) {
  for (const s of e)
    a(t, s);
  return t;
}
const f = (t, ...e) => {
  const s = document.createElement(t);
  return c(s, ...e);
}, o = (t) => (...e) => f(t, ...e);
function r(t, ...e) {
  return typeof t == "string" ? f(t, ...e) : c(t, ...e);
}
const l = new Proxy(r, {
  get: (t, e) => o(e),
  apply(t, e, s) {
    return t.apply(e, s);
  }
});
export {
  l as default
};
