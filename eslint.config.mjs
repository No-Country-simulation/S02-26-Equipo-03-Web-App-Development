import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  {
    ignores: [
      // Default ignores of eslint-config-next:
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Obliga el uso de comillas dobles
      "quotes": ["error", "double"],

      // Obliga el uso de punto y coma al final de las sentencias
      "semi": ["error", "always"],
    },
  },
];

export default eslintConfig;