import css from "@eslint/css";
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
	{
		files: ["**/*.{ts}"],
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			"@typescript-eslint/explicit-function-return-type": [
				"error",
				{
					allowExpressions: true,
					allowTypedFunctionExpressions: false
				}
			],
			"@typescript-eslint/typedef": [
				"error",
				{
					variableDeclaration: true
				}
			],
			"@typescript-eslint/no-inferrable-types": 0
		}
	},
	tseslint.configs.recommended,
	{
		files: ["**/*.css"],
		plugins: { css },
		language: "css/css",
		extends: ["css/recommended"]
	}
]);
