// @ts-check
import eslint from "@eslint/js";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import tseslint from "typescript-eslint";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  /** @type {any} */ (sonarjs.configs?.recommended ?? {}),
  unicorn.configs["recommended"],
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // === Security ===
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",

      // === Basic quality ===
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // === Guardrail #7: Cognitive Complexity ===
      "sonarjs/cognitive-complexity": ["error", 15],

      // === Guardrail #9: Bit ops / legacy API ===
      "no-bitwise": "error",
      "unicorn/prefer-number-properties": "error",

      // === Guardrail #12: Modern API ===
      "@typescript-eslint/prefer-optional-chain": "error",
      "unicorn/prefer-string-starts-ends-with": "error",

      // === Guardrail #14: Promise quality ===
      "prefer-promise-reject-errors": "error",
      "@typescript-eslint/no-floating-promises": "error",

      // === Guardrail #16: SonarQube patterns ===
      "unicorn/prefer-string-replace-all": "error",
      "unicorn/prefer-set-has": "error",
      "unicorn/numeric-separators-style": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",

      // === TypeScript quality ===
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_|^error$",
        },
      ],

      // === Unicorn overrides (disable overly opinionated rules) ===
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/filename-case": "off",
      "unicorn/no-process-exit": "off",
      "unicorn/prefer-module": "off",
      "unicorn/prefer-top-level-await": "off",
      "unicorn/no-abusive-eslint-disable": "off",
      "unicorn/import-style": "off",
      "unicorn/no-useless-undefined": "off",
      "unicorn/prefer-node-protocol": "off", // Cloudflare Workers — no Node.js modules
    },
    linterOptions: {
      reportUnusedDisableDirectives: "warn",
    },
  },
  {
    ignores: ["node_modules/**", "dist/**", ".wrangler/**", "*.js", "*.mjs"],
  },
];
