export type ElementProps = unknown;
import type {
	SpicyElementParams,
	ElementChild,
	ElementProxyFunctions,
} from "./types";

const handleElementProps = <T extends HTMLElement>(
	el: HTMLElement,
	prop: ElementChild | ElementChild[] | SpicyElementParams<T>
) => {
	if (prop instanceof HTMLElement || prop instanceof Text) {
		el.append(prop);
	} else if (prop instanceof Array) {
		el.append(...prop);
	} else if (typeof prop === "string" || typeof prop === "number") {
		el.append(prop.toString());
	} else if (typeof prop === "object" && prop != null) {
		const elementParams = prop as SpicyElementParams<T>;
		for (const key of Object.keys(elementParams)) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			const value = elementParams[key];
			if (typeof value === "function") {
				el.addEventListener(key, value);
			} else if (typeof value === "object" && "handler" in value) {
				el.addEventListener(key, value.handler, value.options);
			} else if (key in el) {
				if (key === "style") {
					Object.assign(el.style, value);
				} else {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					//@ts-ignore
					el[key] = value;
				}
			} else {
				el.setAttribute(key, value);
			}
		}
	}
};
export function updateElement<T extends HTMLElement>(
	el: T,
	...props: (SpicyElementParams<T> | ElementChild | ElementChild[])[]
) {
	for (const prop of props) {
		handleElementProps(el, prop);
	}
	return el;
}

export const createElement = <T extends string>(
	tagName: T,
	...props: ElementChild | ElementChild[] | SpicyElementParams<T>
) => {
	// This typing works, you can see the element types below, but TSC is unhappy about it.
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	const el = document.createElement<T>(tagName);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	return updateElement(el, ...props) as typeof el;
};

export const createSpecificElement =
	<T extends string>(tag: T) =>
	(...props: ElementChild | ElementChild[] | SpicyElementParams<T>) =>
		createElement(tag, ...props);

export default createSpecificElement;

export const spicy = new Proxy(createSpecificElement, {
	get: (_, tag) => createSpecificElement(tag),
}) as unknown as ElementProxyFunctions;

spicy.div("asdf", { click });
