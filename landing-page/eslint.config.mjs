import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "simple-import-sort": (await import("eslint-plugin-simple-import-sort"))
        .default,
    },
    rules: {
      // Import sorting rules
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // External packages (React first, then other libraries)
            ["^react", "^@?\\w"],
            // Internal packages (shadcn/ui components, etc.)
            ["^@/"],
            // Relative imports
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // Style imports
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",

      // General code quality rules
      "prefer-const": "error",
      "no-var": "error",
      "no-console": "warn",
      "no-debugger": "error",
      eqeqeq: ["error", "always"],
      // curly: ["error", "all"],
      quotes: ["error", "double", { avoidEscape: true }],

      // TypeScript rules (using Next.js built-in rules)
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",

      // React rules
      "react/jsx-props-no-spreading": "off",
      "react/prop-types": "off",
      "react/require-default-props": "off",

      // React Hooks rules
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "*.config.{js,ts,mjs}",
      "tailwind.config.{js,ts}",
      ".vscode/**",
      "yarn.lock",
      "package-lock.json",
    ],
  },
];

export default eslintConfig;
