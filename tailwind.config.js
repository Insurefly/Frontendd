/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        mobile: { max: "780px" },
        widescreen: { min: "780px" },
      },
      colors: {
        primary: "#0052CC",      // Strong blue
        secondary: "#00B8D9",    // Light blue
        tertiary: "#4C9AFF",     // Soft blue
        background: "#FFFFFF",    // Kept original
        foreground: "#1a1a1a",   // Kept original
        back: "#FFFFFF",         // Kept original
        front: "#2a2d2f",        // Kept original
        dark: {
            background: "#1B2638", // Dark blue background
            foreground: "#E6ECF5", // Light blue-grey
        },
    },
      content: {
        visible: '""',
      },
      zIndex: {
        1: 1,
      },
      fontFamily: {
        raleway: "'Raleway', sans-serif",
        poppins: "'Poppins', sans-serif",
      },
      transitionDuration: {
        inherit: "inherit",
      },
    },
  },
  plugins: [],
};
