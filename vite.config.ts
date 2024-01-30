import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: "/home/seth/git/spicyjs/src/index.ts",
			name: "spicyJS",
			//make sure filename is 'index'
			fileName: "index",
		},
		rollupOptions: {
			external: [],
			output: {
				globals: {},
			},
		},
	},
});
