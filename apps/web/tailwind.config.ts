import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        ring: "hsl(var(--ring))",
        destructive: "hsl(var(--destructive))"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(16, 24, 40, 0.06), 0 2px 8px rgba(16, 24, 40, 0.04)",
        panel: "0 24px 80px rgba(124, 109, 242, 0.1), 0 2px 12px rgba(16, 24, 40, 0.05)",
        violet: "0 8px 24px rgba(124, 109, 242, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
