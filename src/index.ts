// import { DumbThing } from "./globals";
import type { TagName, TagNameMap } from "./types";
import type {
	SpicyElementParams,
	ElementChild,
	ElementProxyFunctions,
} from "./types";
export type Props<T extends HTMLElement> = (
	| SpicyElementParams<T>
	| ElementChild
	| ElementChild[]
	| undefined
	| false
)[];
type Prop<T extends HTMLElement> = Props<T>[number];
const handleElementProps = <T extends HTMLElement>(
	el: HTMLElement,
	prop: Prop<T>
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
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-ignore
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
				el.setAttribute(key, String(value));
			}
		}
	}
};
function updateElement<T extends HTMLElement>(el: T, ...props: Props<T>) {
	for (const prop of props) {
		handleElementProps(el, prop);
	}
	return el;
}

const createElement = <T extends TagName>(
	tagName: T,
	...props: Props<T extends TagName ? TagNameMap[T] : HTMLElement>
): T extends TagName ? TagNameMap[T] : HTMLElement => {
	// This typing works, you can see the element types below, but TSC is unhappy about it.
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	const el = document.createElement<T>(tagName);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	return updateElement(el, ...props) as typeof el;
};

const createSpecificElement =
	<T extends TagName>(tag: T) =>
	(...props: Props<T extends TagName ? TagNameMap[T] : HTMLElement>) =>
		createElement(tag, ...props);

function createOrUpdateElement<T extends HTMLElement | TagName>(
	element: T,
	...props: Props<T extends TagName ? TagNameMap[T] : T>
): T extends TagName ? TagNameMap[T] : T {
	if (typeof element === "string") {
		//@ts-ignore
		return createElement(element, ...props);
	}
	//@ts-ignore
	return updateElement(element, ...props);
}

type CreateOrUpdateElement = typeof createOrUpdateElement;

const spicy = new Proxy(createOrUpdateElement, {
	get: (_, tag) => createSpecificElement(tag as TagName),
	apply(target, thisArg, args) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		return target.apply(thisArg, args);
	},
}) as unknown as CreateOrUpdateElement & ElementProxyFunctions;
export default spicy;
