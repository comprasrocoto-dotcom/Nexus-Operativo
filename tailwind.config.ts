import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
          "./app/**/*.{ts,tsx}",
          "./components/**/*.{ts,tsx}",
          "./lib/**/*.{ts,tsx}",
        ],
    theme: {
          extend: {
                  colors: {
                            background: "#F8FAFC",
                            primary: {
                                        DEFAULT: "#F97316",
                                        foreground: "#FFFFFF",
                            },
                            secondary: {
                                        DEFAULT: "#2563EB",
                                        foreground: "#FFFFFF",
                            },
                            success: {
                                        DEFAULT: "#22C55E",
                                        foreground: "#FFFFFF",
                            },
                            warning: {
                                        DEFAULT: "#EAB308",
                                        foreground: "#1F2937",
                            },
                            danger: {
                                        DEFAULT: "#EF4444",
                                        foreground: "#FFFFFF",
                            },
                  },
                  borderRadius: {
                            xl: "1rem",
                            xxl: "1.25rem",
                  },
                  boxShadow: {
                            soft: "0 2px 10px -2px rgba(15, 23, 42, 0.08), 0 1px 3px -1px rgba(15, 23, 42, 0.06)",
                            softlg: "0 12px 32px -12px rgba(15, 23, 42, 0.18)",
                  },
                  keyframes: {
                            fadein: {
                                        "0%": { opacity: "0", transform: "translateY(10px)" },
                                        "100%": { opacity: "1", transform: "translateY(0)" },
                            },
                  },
                  animation: {
                            fadein: "fadein 0.5s ease-out both",
                  },
          },
    },
    plugins: [],
};

export default config;
