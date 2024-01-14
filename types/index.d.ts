export type ElementProps = unknown;
import type { SpicyElementParams, ElementChild, ElementProxyFunctions } from "./types";
type Props<T extends HTMLElement> = (SpicyElementParams<T> | ElementChild | ElementChild[])[];
export declare function updateElement<T extends HTMLElement>(el: T, ...props: Props<T>): T;
export declare const createElement: <T extends string>(tagName: T, ...props: Props<HTMLElementTagNameMap[T]>) => HTMLElementTagNameMap[T];
declare function createOrUpdateElement<T extends HTMLElement>(element: T, ...props: Props<T>): T;
declare function createOrUpdateElement<T extends string>(element: T, ...props: Props<HTMLElementTagNameMap[T]>): HTMLElementTagNameMap[T];
declare const spicy: typeof createOrUpdateElement & ElementProxyFunctions;
export default spicy;
