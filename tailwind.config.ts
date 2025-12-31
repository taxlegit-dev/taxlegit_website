import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serifpt: ["var(--font-pt-serif)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
