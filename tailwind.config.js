const config = {
  content: [
    "./src/components/**/*.{js,jsx}",
    "./src/pages/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#635bff",
          600: "#5046e5",
          700: "#4038b8",
        },
        ink: "#171725",
      },
      boxShadow: {
        soft: "0 20px 60px rgba(24, 24, 40, 0.08)",
      },
    },
  },
  plugins: [],
};

module.exports = config;
