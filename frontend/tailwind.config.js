export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        card: "var(--card)",
        text: "var(--text)",
        muted: "var(--muted)",
        border: "var(--border)",

        primary: "#10b981",
        secondary: "#14b8a6",
        accent: "#06b6d4",

        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        info: "#3b82f6",

        overlay: {
          DEFAULT: "rgba(0,0,0,0.6)",
          light: "rgba(0,0,0,0.3)",
          heavy: "rgba(0,0,0,0.8)",
        },
      },

      backgroundImage: {
        "brand-gradient":
          "linear-gradient(to right, #10b981, #14b8a6, #06b6d4)",
        "brand-gradient-hover":
          "linear-gradient(to right, #059669, #0d9488, #0891b2)",
        "sidebar-gradient":
          "linear-gradient(to bottom, #020617, #0f172a, #000000)",
      },

      boxShadow: {
        soft: "0 0 20px rgba(16,185,129,0.15)",
        brand: "0 10px 15px -3px rgba(16,185,129,0.15)",
        "brand-hover": "0 20px 25px -5px rgba(16,185,129,0.25)",
        card: "0 8px 20px rgba(0,0,0,0.08)",
        dropdown: "0 20px 40px rgba(0,0,0,0.25)",
      },

      borderRadius: {
        brand: "1rem",
        xl2: "1.25rem",
        xl3: "1.5rem",
      },

      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
      },

      transitionDuration: {
        250: "250ms",
        350: "350ms",
        400: "400ms",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        soft: "cubic-bezier(0.16, 1, 0.3, 1)",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },

        slideUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        slideLeft: {
          "0%": {
            opacity: "0",
            transform: "translateX(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },

        scaleIn: {
          "0%": {
            opacity: "0",
            transform: "scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },

      animation: {
        fade: "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.35s ease-out",
        "slide-left": "slideLeft 0.35s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
    },
  },

  plugins: [],
};