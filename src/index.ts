export type ElementProps = unknown;
import type {
	SpicyElementParams,
	ElementChild,
	ElementProxyFunctions,
} from "./types";
type Props<T extends HTMLElement> = (
	| SpicyElementParams<T>
	| ElementChild
	| ElementChild[]
)[];
type Prop = Props[number];
const handleElementProps = <T extends HTMLElement>(
	el: HTMLElement,
	prop: Prop
) => {
	const addListener = el.addEventListener;
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
				addListener(key, value);
			} else if (typeof value === "object" && "handler" in value) {
				addListener(key, value.handler, value.options);
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
	...props: Props<T>
) {
	for (const prop of props) {
		handleElementProps(el, prop);
	}
	return el;
}

export const createElement = <T extends string>(
	tagName: T,
	...props: Props<HTMLElementTagNameMap[T]>
) => {
	// This typing works, you can see the element types below, but TSC is unhappy about it.
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	const el = document.createElement<T>(tagName);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	return updateElement(el, ...props) as typeof el;
};

const createSpecificElement =
	<T extends string>(tag: T) =>
	(...props: Props<T>) =>
		createElement(tag, ...props);

function createOrUpdateElement<T extends HTMLElement>(
	element: T,
	...props: Props<T>
): T;

function createOrUpdateElement<T extends string>(
	element: T,
	...props: Props<HTMLElementTagNameMap[T]>
): HTMLElementTagNameMap[T];

function createOrUpdateElement(element, ...props) {
	if (typeof element === "string") {
		return createElement<T>(element, ...props);
	} else if (element instanceof HTMLElement) {
		return updateElement<T>(element, ...props);
	}
}
type CreateOrUpdateElement = typeof createOrUpdateElement;

const spicy = new Proxy(createOrUpdateElement, {
	get: (_, tag) => createSpecificElement(tag),
	apply(target, thisArg, args) {
		return target.apply(thisArg, args);
	},
}) as unknown as CreateOrUpdateElement & ElementProxyFunctions;
export default spicy;

// const asdf = spicy("a", { href });
// const qwer = spicy("div");
// const zxcv = spicy(spicy("a"), { href });
// const { div, a } = spicy;
// a({ href });
