import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nova: {
          // Brand colors — orange replaces dark red
          red: '#F97316',      // primary orange (replaces old red)
          orange: '#FB923C',   // secondary orange
          yellow: '#FBBF24',   // amber accent
          // Light theme surface tokens
          dark: '#FFF7ED',     // warm beige section bg (formerly dark bg)
          darker: '#FFFFFF',   // white page bg (formerly darkest bg)
          navy: '#FFFFFF',     // white card bg (formerly navy)
          // Text tokens
          text: '#1F2937',     // gray-800 body text
          muted: '#6B7280',    // gray-500 secondary text
          subtle: '#9CA3AF',   // gray-400 muted text
          // Surface
          surface: '#FFF0E4',  // warm light orange surface
          border: '#E5E7EB',   // light border
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "nova-gradient": "linear-gradient(135deg, #F97316, #FB923C)",
        "nova-gradient-soft": "linear-gradient(135deg, #FFF7ED, #FFF0E4, #FECACA20)",
      },
      boxShadow: {
        "nova-sm": "0 2px 12px rgba(249,115,22,0.12)",
        "nova-md": "0 4px 24px rgba(249,115,22,0.18)",
        "nova-lg": "0 8px 40px rgba(249,115,22,0.24)",
        "card": "0 2px 16px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.12)",
      },
      animation: {
        "fade-in-down": "fade-in-down 0.8s ease-out forwards",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        "fade-in-down": {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
