/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-work-sans)"],
      },
      colors: {
        primary: {
          50: "hsl(208, 100%, 97%)",
          100: "hsl(208, 100%, 93%)",
          200: "hsl(205, 100%, 87%)",
          300: "hsl(204, 100%, 78%)",
          400: "hsl(206, 100%, 68%)",
          500: "hsl(210, 84%, 51%)",
          600: "hsl(216, 69%, 45%)",
          700: "hsl(218, 33%, 40%)",
          800: "hsl(220, 65%, 26%)",
          900: "hsl(220, 61%, 22%)",
          950: "hsl(218, 60%, 18%)",
          DEFAULT: "hsl(220, 65%, 26%)",
        },
        secondary: {
          50: "hsl(33, 100%, 96%)",
          100: "hsl(36, 100%, 89%)",
          200: "hsl(39, 100%, 77%)",
          300: "hsl(40, 100%, 65%)",
          400: "hsl(41, 100%, 56%)",
          500: "hsl(38, 95%, 50%)",
          600: "hsl(35, 98%, 44%)",
          700: "hsl(32, 94%, 37%)",
          800: "hsl(32, 85%, 31%)",
          900: "hsl(34, 80%, 26%)",
          950: "hsl(38, 94%, 14%)",
          DEFAULT: "hsl(41, 100%, 56%)",
        },
        tertiary: {
          50: "hsl(171, 41%, 97%)",
          100: "hsl(175, 42%, 89%)",
          200: "hsl(176, 42%, 78%)",
          300: "hsl(178, 40%, 64%)",
          400: "hsl(180, 34%, 48%)",
          500: "hsl(181, 41%, 40%)",
          600: "hsl(183, 43%, 32%)",
          700: "hsl(183, 40%, 26%)",
          800: "hsl(185, 35%, 22%)",
          900: "hsl(182, 32%, 19%)",
          950: "hsl(189, 41%, 10%)",
          DEFAULT: "hsl(180, 34%, 48%)",
        },
        grey: {
          50: "hsl(NaN, 0%, 97%)",
          100: "hsl(NaN, 0%, 94%)",
          200: "hsl(NaN, 0%, 86%)",
          300: "hsl(NaN, 0%, 74%)",
          400: "hsl(NaN, 0%, 60%)",
          500: "hsl(NaN, 0%, 49%)",
          600: "hsl(NaN, 0%, 40%)",
          700: "hsl(NaN, 0%, 32%)",
          800: "hsl(NaN, 0%, 27%)",
          900: "hsl(NaN, 0%, 24%)",
          950: "hsl(NaN, 0%, 16%)",
          DEFAULT: "hsl(NaN, 0%, 97%)",
        },
        textColor: "hsl(215, 100%, 11%)",
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
      },
      margin: {
        headerOffset: "var(--header-height)",
      },
      padding: {
        headerOffset: "var(--header-height)",
      },
      height: {
        header: "var(--header-height)",
      },
    },
  },
};
