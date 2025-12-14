import type { Props, TagName, TagNameMap } from "./types";
import type { SpicyElementParams, ElementProxyFunctions } from "./types";
export type { SpicyElementParams };
declare function createOrUpdateElement<T extends HTMLElement | TagName>(element: T, ...props: Props<T extends TagName ? TagNameMap[T] : T>): T extends TagName ? TagNameMap[T] : T;
type CreateOrUpdateElement = typeof createOrUpdateElement;
declare const spicy: CreateOrUpdateElement & ElementProxyFunctions;
export default spicy;
