import { expect, test, vi, beforeAll, beforeEach } from "vitest";
import spicyjs from "../src/index";

beforeEach(() => {
	document.body.innerHTML = "";
	document.body.className = "";
});

test("creates a div element with an id, style, attribute, and classname", () => {
	const { div } = spicyjs;
	const mydiv = div(
		{
			id: "my-id",
			className: "my-class",
			style: { color: "blue" },
			"data-testid": "attr",
		},
		"hello world"
	);
	expect(mydiv.className).toEqual("my-class");
	expect(mydiv.id).toEqual("my-id");
	expect(mydiv.style.color).toEqual("blue");
	expect(mydiv.textContent).toEqual("hello world");
	expect(mydiv.getAttribute("data-testid")).toEqual("attr");
});

test("creates a div element using a method param to set attributes", () => {
	const { div } = spicyjs;
	const mydiv = div(
		(div) => (div.className = "my-class"),
		{
			id: "my-id",
			style: { color: "blue" },
			"data-testid": "attr",
		},
		"hello world"
	);
	expect(mydiv.className).toEqual("my-class");
	expect(mydiv.id).toEqual("my-id");
	expect(mydiv.style.color).toEqual("blue");
	expect(mydiv.textContent).toEqual("hello world");
	expect(mydiv.getAttribute("data-testid")).toEqual("attr");
});

test("adds event listeners", () => {
	const clickhandler = vi.fn();
	const myEventHandler = vi.fn();
	const optionsEventHandler = vi.fn();
	const abortController = new AbortController();
	const mydiv = spicyjs.div({
		click: clickhandler,
		"my-event": myEventHandler,
		"options-event": {
			handler: optionsEventHandler,
			options: {
				capture: true,
				signal: abortController.signal,
			},
		},
	});
	mydiv.click();
	mydiv.dispatchEvent(new CustomEvent("my-event"));
	mydiv.dispatchEvent(new CustomEvent("options-event"));
	abortController.abort();
	mydiv.dispatchEvent(new CustomEvent("options-event"));
	expect(clickhandler).toHaveBeenCalledOnce();
	expect(optionsEventHandler).toHaveBeenCalledOnce();
	expect(myEventHandler).toHaveBeenCalled();
});
test("appends children", () => {
	const { div, span, button, form, input } = spicyjs;
	let container: HTMLDivElement;
	const mydiv = div(
		form(
			(container = div(
				span("fill this out"),
				input({ value: "some-value", placeholder: "eg john smith" })
			)),
			button("submit")
		)
	);
	expect(mydiv.querySelector("span")?.parentElement).toEqual(container);
	const myinput = mydiv.querySelector<HTMLInputElement>("input");
	expect(myinput?.value).toEqual("some-value");
	expect(myinput?.getAttribute("placeholder")).toEqual("eg john smith");
	expect(mydiv.querySelector("form")?.children[1].textContent).toEqual(
		"submit"
	);
});

test("creates custom elements", () => {
	const { "my-element": MyElement }: { "my-element": () => HTMLElement } =
		spicyjs;
	const myEl = MyElement();
	expect(myEl.nodeName).toEqual("MY-ELEMENT");
});

test("updates existing elements", () => {
	const clickhandler = vi.fn();
	spicyjs(
		document.body,
		{
			click: clickhandler,
			className: "my-class",
		},
		spicyjs("a", "my link")
	);
	document.body.click();
	expect(clickhandler).toHaveBeenCalled();
	expect(document.body.querySelector("a")).toBeTruthy();
});
test("appends elements from arrays", () => {
	const { a } = spicyjs;
	const links = ["link1", "link2", "link3"];
	spicyjs(
		document.body,
		links.map((text) => a(text))
	);
	expect(document.body.querySelectorAll("a").length).toEqual(3);
	expect(document.body.querySelectorAll("a")[2].textContent).toEqual("link3");
});
test("does not append falsey values", () => {
	const { a } = spicyjs;
	const links = ["link1", "link2", "link3"];
	spicyjs(document.body, false, "");
	expect(document.body.childNodes.length).toEqual(1);
});
