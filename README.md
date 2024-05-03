# SpicyJS

SpicyJS is a buildless microframework with a VanillaJS mental model that consists of a few tiny packages:

- @spicyjs/core: a JS library that takes the pain out of creating, updating, and attaching listeners to elements. (~1kb before gzip)
- @spicyjs/reactor: a Reactive library that binds data to nodes (~1kb before gzip)
- @spicyjs/router: a lightweight router for SPA's (~2kb before gzip)

## Why

Spice up your project with SpicyJS. A fully featured package suite that can be used to enhance static pages or to build full blown SPA's. Each package has zero dependencies and can be used without the others. Tired of the boilerplate around `document.createElement`? Grab `@spicyjs/core`. If you need a router for an SPA, grab `@spicyjs/router`. Need some reactivity? Grab `@spicyjs/reactor`. If you end up using them all, you'll only add ~4kb to your site.

## Installation

```bash
npm i @spicyjs/core
```

## Usage

```js
import spicy from "@spicyjs/core";
const { div, button, h2, span } = spicy;
//the default export also works as a function: spicy('header', {...options}, 'this is a header'), etc
let display: HTMLSpanElement | null = null;
let count = 0;

export const counter = () =>
	div(
		{ className: "tw-flex tw-flex-col tw-gap-3" },
		h2("Counter"),
		(display = span("count: 0")),
		button("increment", {
			type: "button",
			click: () => (display.textContent = `count: ${++count}`),
		})
	);

document.body.append(counter());
```

the counter function creates the following DOM structure when invoked:

```html
/**
<div class="tw-flex tw-flex-col tw-gap-3">
	<h2>Counter</h2>
	<span>count: 0</span>
	<button>increment</button>
</div>
*/
```

Any element can be created, even custom components. Custom elements can be typed by updating the HTMLTagNameMap type.

```ts
import { TestComponent } from "./TestComponent";

declare global {
	interface HTMLElementTagNameMap {
		"test-component": TestComponent;
	}
}
```

Now we can get this element too with

```ts
import spicy from "@spicyjs/core";
const { "test-component": TestComponent, marquee } = spicy;
export const EpicComponent = () => {
	return TestComponent({ someProp: 33 }, marquee());
};
```

Arguments passed to the element functions can be another HTML element, an array of HTMLElements, a Text Node, strings, or an object.

Elements or an array of elements will be appended to the created element.

Strings will be appended as Text Nodes.

An object takes the form of {key: boolean|string|number|function}.

- If the value is a function, the function will be added as an event handler for the event matching the key. E.g. 'click', 'mousemove', etc. Custom Events can be matched as well.
- If the key is a prop on the element, the associated value will be added as a prop.
- Otherwise, the key/value pair will be added as an attribute

The default object is also a function that can be used to update existing elements with the same params, though the first becomes the existing element.

Another, more complex example:

```ts
import spicy from "@spicyjs/core";
const { div, ul, li, input } = spicy;

const menu = [
	{ name: "Tea", price: "$3.00" },
	{ name: "Coffee", price: "$4.00" },
];
let filter = "";
let list = null;
const createList = menu
	.filter(({ name }) => name.includes(filter))
	.map(({ name, price }) => li(`${name}: ${price}`));

const updateList = () => {
	//this is not efficient, but gets the idea across
	let newList = createList();
	if (list) {
		//illustrates how params are executed. First the html will be cleared, then the list appended
		spicy(list, { innerHTML: "" }, newList);
		//could also just do list.replaceWith(newList)
	}
};
document.body.append(
	input({ value: filter, placeholder: "Filter...", input: updateList }),
	div((list = ul(createList())))
);
```

## Reactivity

```bash
npm i @spicyjs/reactor;
```

Reactivity is Proxy based. You create a reactor by invoking the reactor function, similar to a Vue ref. The resulting variable is a function with a value property.

If invoked as a function, a side effect is added. A side effect may be a text node, an HTMLElement, or a function.

Note that object and array require some special handling if accessed within their own effects.

```ts
import spicy from "@spicyjs/core";
import { reactor } from "@spicyjs/reactor";

const { div, button, span, input, label } = spicy;

const count = reactor(0);
const increment = () => count.value++;

export const counter = () =>
	div(span(count()), button("increment", { click: increment }));

const firstName = reactor("");
const lastName = reactor("");
const fullName = reactor(() => `${firstName.value} ${lastName.value}`);

//Objects should be accessed inside their own effects with 'raw', do not update objects inside their own effects
const people = reactor(["steve", "jeff", "ronald"]);
people(() => {
	const items = people.raw.map((person) => li(person));
	//etc
});

//register side effect
const effect = fullName(() => console.log("full name updated!"));

export const fullNameGenerator = () =>
	div(
		span(fullName()),
		label({ for: "firstname" }, "First Name"),
		input({
			id: "firstname",
			input: ($event) => (firstName.value = $event.target.value),
		}),
		label({ for: "lastname" }, "Last Name"),
		input({
			id: "lastname",
			input: ($event) => (lastName.value = $event.target.value),
		})
	);

// cleanup
// fullname.removeEffect(effect);
// OR
// fullName.destroy();
// lastName.destroy(); //etc
// OR
// import { meltdown } from @spicyjs/reactor;
// meltdown(firstName, lastName, fullName);
```

As noted in the example, to keep the package size small, object and array methods have not been enumerated and checked against inside reactors. Accessing array methods inside an effect will trigger a call stack exceeded error. To access objects inside their effects, refer to them with `.raw`.
