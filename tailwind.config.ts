import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        marca: {
          DEFAULT: "#E4572E",
          suave: "#FBE9E2",
          oscuro: "#B23F1D",
        },
      },
    },
  },
  plugins: [],
};
export default config;
