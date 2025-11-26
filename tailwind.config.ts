import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "desa-green": "#059669", // Emerald 600
                "desa-gold": "#d97706", // Amber 600
                "desa-white": "#f8fafc", // Slate 50
                "desa-dark": "#064e3b", // Emerald 900
            },
        },
    },
    plugins: [],
};
export default config;
