import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		typescript: {
			config: (config) => {
				return {
					...config,
					include: [
						...config.include,
						"../svelte.config.js",
						"../tailwind.config.js",
						"../.eslintrc.cjs",
						"../postcss.config.js",
					],
				};
			},
		},
	},
};

export default config;
