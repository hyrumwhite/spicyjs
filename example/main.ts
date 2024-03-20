import spicyjs from "../src/index";

const { div, span, a } = spicyjs;
const thing = "asdf";
const img = spicyjs("img");
const anchor = a();
const app = document.getElementById("app");
const href = "https://google.com";
spicyjs(
	app,
	{
		click(ev) {
			console.log(ev);
		},
	},
	div`hey ${thing} worlds`,
	a("testings", { href }, "override")
);
