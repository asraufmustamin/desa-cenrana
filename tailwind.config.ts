import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./context/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Futuristic Smart Village 2030 Palette
                "neon-blue": "#00D4FF",
                "neon-emerald": "#10B981",
                "neon-purple": "#8B5CF6",
                "neon-orange": "#F97316",
                "neon-pink": "#EC4899",
                "dark-base": "#0A0F1A",
                "dark-surface": "#111827",
                "dark-card": "#1F2937",
                "dark-border": "rgba(255, 255, 255, 0.08)",
                // Legacy (for compatibility)
                "desa-green": "#10B981",
                "desa-sage": "#8DA399",
                "desa-forest": "#2F4F4F",
                "desa-charcoal": "#333333",
                "desa-white": "#FFFFFF",
            },
            fontFamily: {
                sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'glow-blue': '0 0 30px rgba(0, 212, 255, 0.3)',
                'glow-emerald': '0 0 30px rgba(16, 185, 129, 0.3)',
                'glow-purple': '0 0 30px rgba(139, 92, 246, 0.3)',
                'glow-orange': '0 0 30px rgba(249, 115, 22, 0.3)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
                'gradient-shift': 'gradient-shift 8s ease infinite',
            },
        },
    },
    plugins: [],
};
export default config;
