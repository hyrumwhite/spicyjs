import type { TagName, TagNameMap } from "./types";
import type { SpicyElementParams, ElementChild, ElementProxyFunctions } from "./types";
export type Props<T extends HTMLElement> = (SpicyElementParams<T> | ElementChild | ElementChild[] | undefined | false)[];
declare function createOrUpdateElement<T extends HTMLElement | TagName>(element: T, ...props: Props<T extends TagName ? TagNameMap[T] : T>): T extends TagName ? TagNameMap[T] : T;
declare const spicy: typeof createOrUpdateElement & ElementProxyFunctions;
export default spicy;
