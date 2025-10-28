import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "saprix-black-blue": "#060321", // Paleta Base [cite: 14]
        "saprix-electric-blue": "#2500ff", // Paleta Acento [cite: 15]
        "saprix-indigo": "#233775", // Paleta Secundario [cite: 16]
        "saprix-white": "#FFFFFF", // Texto [cite: 17]
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"], // Tipografía
      },
      borderRadius: {
        lg: "4px", // Ángulos rectos (un tris redondeado) [cite: 19]
      },
    },
  },
  plugins: [],
};

export default config;