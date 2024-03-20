export class TestComponent extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}
	get name() {
		return "bob";
	}
	connectedCallback() {
		this.render();
	}
	render() {
		this.shadowRoot?.append(
			document
				.createElement("div")
				.appendChild(document.createTextNode("Hello World!"))
		);
	}
}
