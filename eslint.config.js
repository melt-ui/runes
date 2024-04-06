import config from "@antfu/eslint-config";
import huntabytePlugin from "@huntabyte/eslint-plugin";

export default config({
	stylistic: {
		indent: "tab",
		quotes: "double",
		semi: true,
		overrides: {
			"antfu/if-newline": "off",
			"curly": ["error", "multi-line"],
			"style/brace-style": ["error", "1tbs", { allowSingleLine: true }],
		},
	},
	ignores: [
		".DS_Store",
		"**/.DS_Store/**",
		"node_modules",
		"**/node_modules/**",
		"build",
		"build/**",
		"dist",
		"dist/**",
		".svelte-kit",
		".svelte-kit/**",
		"package",
		"package/**",
		".env",
		"**/.env/**",
		".env.*",
		"**/.env.*/**",
		"!.env.example",
		"!**/.env.example/**",
		"pnpm-lock.yaml",
		"**/pnpm-lock.yaml/**",
		"package-lock.json",
		"**/package-lock.json/**",
		"yarn.lock",
		"**/yarn.lock/**",
	],
	svelte: true,
	typescript: true,
	componentExts: ["svelte"],
}).override("antfu/typescript/rules", {
	rules: {
		"ts/consistent-type-definitions": ["error", "type"],
		"ts/no-this-alias": "off",
		"ts/no-explicit-any": "error",
	},
}).override("antfu/svelte/setup", {
	plugins: {
		huntabyte: huntabytePlugin,
	},
}).override("antfu/svelte/rules", {
	rules: {
		"prefer-const": "off",
		"huntabyte/top-level-function": "error",
	},
});
