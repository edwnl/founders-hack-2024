/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#ffffff",
        card: "#1e1e1e",
        "card-foreground": "#ffffff",
        popover: "#1e1e1e",
        "popover-foreground": "#ffffff",
        primary: "#ffffff",
        "primary-foreground": "#000000",
        secondary: "#27272a",
        "secondary-foreground": "#ffffff",
        muted: "#383838",
        "muted-foreground": "#a1a1aa",
        accent: "#27272a",
        "accent-foreground": "#ffffff",
        destructive: "#7f1d1d",
        "destructive-foreground": "#ffffff",
        border: "#27272a",
        input: "#27272a",
        ring: "#27272a",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
