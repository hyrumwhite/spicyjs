import { TestComponent } from "./TestComponent";

declare global {
	interface HTMLElementTagNameMap {
		"spicy-element": TestComponent;
		// "spicy-element": boolean;
	}
	interface DumbThing {
		asdf: boolean;
	}
}
