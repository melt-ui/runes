import antfu from "@antfu/eslint-config";

export default antfu({
	stylistic: {
		indent: "tab",
		quotes: "double",
		semi: true,
		overrides: {
			"ts/consistent-type-definitions": ["error", "type"],
			"curly": ["error", "all"],
			"style/brace-style": ["error", "1tbs", { allowSingleLine: false }],
		},
	},
});
