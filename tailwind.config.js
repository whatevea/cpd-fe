/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary_black: "#092327",
        primary_white: "#90C2E7",
        light_white: "#4E8098",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-10px)" },
          "40%": { transform: "translateX(10px)" },
          "60%": { transform: "translateX(-10px)" },
          "80%": { transform: "translateX(10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        shake: "shake 0.3s cubic-bezier(.36,.07,.19,.97) both",
        fadeIn: "fadeIn 0.5s ease-in",
        slideIn: "slideIn 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
