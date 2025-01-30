
const {heroui} = require("@heroui/theme");
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(dropdown|navbar|toggle|menu|divider|popover|button|ripple|spinner).js",
    "./node_modules/@heroui/theme/dist/components/(date-picker|button|ripple|spinner|calendar|date-input|form|popover).js"
  ],
  theme: {
    extend: {},
  },
  plugins: [heroui()],
};