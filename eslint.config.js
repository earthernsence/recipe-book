import tsParser from "@typescript-eslint/parser";
import importSort from "eslint-plugin-simple-import-sort";
import sveltePlugin from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";

export default [
  ...sveltePlugin.configs["flat/recommended"],
  {
    plugins: {
      "simple-import-sort": importSort
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000"], // side-effect imports
            ["^@?\\w"], // library imports
            ["^\\$lib", "^\\."] // internal ($lib/**) then relative
          ]
        }
      ],
      "simple-import-sort/exports": "error"
    }
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser
      }
    }
  },
  {
    ignores: ["drizzle/", ".svelte-kit/", "build/"]
  }
];
