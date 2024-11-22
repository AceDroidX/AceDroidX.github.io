/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./.vitepress/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    darkMode: ["selector", ".dark"],
};
