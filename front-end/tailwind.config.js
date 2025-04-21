// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          orange: {
            400: '#FF7E33',
            500: '#FF5700',
            600: '#E04E00',
          },
          purple: {
            400: '#9D3DFF',
            500: '#8A2BE2',
            600: '#7926C9',
            900: '#3A1266',
          },
          gray: {
            800: '#1F1F1F',
            900: '#121212',
          },
        },
        screens: {
          'xs': '480px',
          'sm': '640px',
          'md': '768px',
          'tablet': {'min': '750px', 'max': '769px'}, // Target specific 758px width
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1536px',
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        },
        animation: {
          'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        boxShadow: {
          'neon': '0 0 10px rgba(138, 43, 226, 0.5), 0 0 20px rgba(138, 43, 226, 0.3)',
          'neon-orange': '0 0 10px rgba(255, 87, 0, 0.5), 0 0 20px rgba(255, 87, 0, 0.3)',
        },
      },
    },
    plugins: [
      require('@tailwindcss/line-clamp'),
    ],
  }