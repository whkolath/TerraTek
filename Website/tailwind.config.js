
const {heroui} = require("@heroui/theme");
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(date-picker|drawer|dropdown|modal|navbar|toggle|button|ripple|spinner|calendar|date-input|form|popover|menu|divider).js"
  ],
  theme: {
    extend: {},
  },
  plugins: [heroui()],
};