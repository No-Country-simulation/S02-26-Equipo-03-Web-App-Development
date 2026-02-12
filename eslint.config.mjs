import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    rules: {
      // Enforce the use of double quotes
      "quotes": ["error", "double"],

      // Enforce the use of semicolons at the end of statements
      "semi": ["error", "always"],
    },
  },
];

export default eslintConfig;