import config from '@antfu/eslint-config';
import tailwindPlugin from 'eslint-plugin-tailwindcss';

export default config({
	stylistic: {
		indent: 'tab',
		overrides: {
			'max-len': ['error', { code: 120 }],
			'antfu/if-newline': 'off',
			'sort-keys': 'off',
		},
		semi: true,
	},
	ignores: [
		'.DS_Store',
		'**/.DS_Store/**',
		'node_modules',
		'**/node_modules/**',
		'build',
		'build/**',
		'.svelte-kit',
		'.svelte-kit/**',
		'package',
		'package/**',
		'.env',
		'**/.env/**',
		'.env.*',
		'**/.env.*/**',
		'!.env.example',
		'!**/.env.example/**',
		'pnpm-lock.yaml',
		'**/pnpm-lock.yaml/**',
		'package-lock.json',
		'**/package-lock.json/**',
		'yarn.lock',
		'**/yarn.lock/**',
	],
	svelte: true,
}, {
	plugins: { tailwindcss: tailwindPlugin },
	rules: {
		'tailwindcss/classnames-order': 'warn',
		'tailwindcss/enforces-negative-arbitrary-values': 'warn',
		'tailwindcss/enforces-shorthand': 'warn',
		'tailwindcss/migration-from-tailwind-2': 'warn',
		'tailwindcss/no-arbitrary-value': 'off',
		'tailwindcss/no-custom-classname': ['warn', {
			whitelist: ['dark'],
		}],
		'tailwindcss/no-contradicting-classname': 'error',
		'tailwindcss/no-unnecessary-arbitrary-value': 'warn',
	},
});
