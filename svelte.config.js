import { sequence } from "@melt-ui/pp";
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: sequence([vitePreprocess()]),
	kit: {
		adapter: adapter(),
	},
};

export default config;
