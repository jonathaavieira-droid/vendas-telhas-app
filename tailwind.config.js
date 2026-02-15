/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Deep Navy / Void Black (Background)
                background: '#020617',
                // Dark Slate (Card Surface)
                surface: '#0f172a',
                // Light Grey (Text Primary)
                primary: '#e2e8f0',
                // Slate Grey (Text Secondary)
                muted: '#94a3b8',
                // Safety Orange (High Vis Accent)
                secondary: '#f59e0b',
                // Electric Blue (Tech Highlights)
                accent: '#0ea5e9',
                // Functional
                success: '#10b981',
                danger: '#ef4444',
                warning: '#f59e0b',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Roboto Mono', 'monospace'],
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
            },
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.16)',
                'float': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
                'glow': '0 0 20px rgba(245, 158, 11, 0.15)',
            }
        },
    },
    plugins: [],
}
