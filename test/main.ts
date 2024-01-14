import spicyjs from "../src/index";

const { div, span, a } = spicyjs;
const thing = "asdf";
const img = spicyjs("img", {});
const app = document.getElementById("app");
spicyjs(
	app,
	{
		click(ev) {
			console.log(ev);
		},
	},
	div`hey ${thing} worlds`,
	a("testings", { href })
);
