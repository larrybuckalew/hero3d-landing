// ESLint 9 flat config. eslint-config-next v16 ships native flat configs, so
// no FlatCompat/@eslint/eslintrc bridge is needed (it actually crashes on 9.39).
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "next-env.d.ts",
    "shots/**",
    "*.log",
  ]),
]);
