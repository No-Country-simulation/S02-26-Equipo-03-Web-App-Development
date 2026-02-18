import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./shared/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#3B82F6",
        "cool-gray": "#697386",
      },
      backgroundImage: {
        "gradient-cta": "linear-gradient(to bottom right, #0066FF, #8B5CF6)",
      },
    },
  },
  plugins: [],
};

export default config;