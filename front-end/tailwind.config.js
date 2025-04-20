// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Add your custom colors here, if needed
        },
        fontFamily: {
          sans: [
            'Inter',
            'ui-sans-serif',
            'system-ui',
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Helvetica Neue',
            'Arial',
            'sans-serif',
          ],
        },
        spacing: {
          // Add your custom spacing here, if needed
        },
        boxShadow: {
          // Add your custom shadows here
          card: '0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.08)',
        },
        borderRadius: {
          // Add your custom border radius here, if needed
        },
        zIndex: {
          // Add your custom z-index values here, if needed
          '100': '100',
        },
        animation: {
          // Add your custom animations here, if needed
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
    ],
  };