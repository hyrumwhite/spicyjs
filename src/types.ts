//create a type for an object with string keys and values that can be strings, numbers, or event functions, the 'style' key specifically should be a CSSStyleDeclaration
type SpicyElementProps<T extends HTMLElement> = { [K in keyof T]: T[K] };
type SpicyElementAttributes = Record<
	string,
	string | number | boolean | EventListener
>;
export type Events = {
	[K in keyof HTMLElementEventMap]:
		| {
				handler: (ev: HTMLElementEventMap[K]) => any;
				options?: boolean | AddEventListenerOptions;
		  }
		| ((ev: HTMLElementEventMap[K]) => any);
};
type Elements = HTMLElementTagNameMap;
export type SpicyElementParams<T extends HTMLElement> = Omit<
	SpicyElementProps<T>,
	"click" | "focus" | "blur"
> &
	SpicyElementAttributes &
	Events;

export type ElementChild = HTMLElement | Text | String | Number;

export type ElementProxyFunctions = {
	[k in keyof Elements]: (
		...props: (
			| SpicyElementParams<Elements[k]>
			| ElementChild
			| ElementChild[]
		)[]
	) => Elements[k];
};
