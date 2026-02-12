import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
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