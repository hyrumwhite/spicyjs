var HANDLER_KEY = "handler", handleElementProps = (r, i) => {
	if (typeof i == "function") i(r);
	else if (i instanceof Array) r.append(...i);
	else if (!(i instanceof Node) && typeof i == "object" && i) {
		let a = i;
		for (let i of Object.keys(a)) {
			let o = a[i];
			typeof o == "function" ? r.addEventListener(i, o) : typeof o == "object" && HANDLER_KEY in o ? r.addEventListener(i, o[HANDLER_KEY], o.options) : i in r ? i === "style" ? Object.assign(r.style, o) : r[i] = o : r.setAttribute(i, String(o));
		}
	} else (i || typeof i == "string") && r.append(i);
}, updateElement = (e, ...i) => {
	for (let a of i) handleElementProps(e, a);
	return e;
}, createElement = (e, ...r) => updateElement(document.createElement(e), ...r), createSpecificElement = (e) => (...r) => createElement(e, ...r);
function createOrUpdateElement(e, ...r) {
	return typeof e == "string" ? createElement(e, ...r) : updateElement(e, ...r);
}
var src_default = new Proxy(createOrUpdateElement, { get: (e, r) => createSpecificElement(r) });
export { src_default as default };
