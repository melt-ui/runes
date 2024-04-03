import plugin from "tailwindcss/plugin.js";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {},
	},
	plugins: [
		plugin(({ addComponents }) => {
			addComponents({
				".btn": tw(
					"relative inline-flex h-10 items-center justify-center rounded-md border border-current px-6",
					"before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:transition-[opacity] before:duration-75",
					"hover:before:bg-current hover:before:opacity-[0.08]",
					"focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-current",
					"active:before:bg-current active:before:opacity-[0.12]",
					"disabled:pointer-events-none disabled:border-neutral-300/[0.12] disabled:text-neutral-300/[0.38]",
				),
				".tooltip": tw("rounded bg-gray-50 px-2 py-1 text-sm text-gray-950"),
			});
		}),
	],
};

/**
 * @param {string[]} classes
 */
function tw(...classes) {
	return {
		[`@apply ${classes.join(" ")}`]: "",
	};
}
