export type TagNameMap = HTMLElementTagNameMap;
export type TagName = keyof TagNameMap;
type SpicyElementProps<T extends HTMLElement> = {
    [K in keyof T]: T[K];
};
export type Events = {
    [K in keyof HTMLElementEventMap]: {
        handler: (ev: HTMLElementEventMap[K]) => any;
        options?: boolean | AddEventListenerOptions;
    } | ((ev: HTMLElementEventMap[K]) => any);
};
type Elements = HTMLElementTagNameMap;
export type SpicyElementParams<T extends HTMLElement> = Partial<Events> & Partial<Omit<SpicyElementProps<T>, "click" | "focus" | "blur">> & {
    [key: string]: any;
};
export type ElementChild = Node | string;
export type Props<T extends HTMLElement> = (SpicyElementParams<T> | ElementChild | ElementChild[] | ((el: T) => void) | undefined | false)[];
export type ElementProxyFunctions = {
    [k in keyof Elements]: (...props: Props<Elements[k]>) => Elements[k];
};
export {};
