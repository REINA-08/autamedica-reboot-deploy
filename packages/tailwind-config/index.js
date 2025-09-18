// ESM export
/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      colors: {
        // Variables CSS para compatibilidad con themes dinámicos
        background: "var(--background)",
        foreground: "var(--foreground)",

        // AutaMedica Brand Colors - Colores corporativos oficiales
        "autamedica-ivory": "var(--ivory)",
        "autamedica-beige": "var(--beige)",
        "autamedica-negro": "var(--negro)",
        "autamedica-blanco": "var(--blanco)",

        // UI Colors - Sistema de colores de interfaz
        "autamedica-primary": "var(--primary)",
        "autamedica-primary-dark": "var(--primary-dark)",
        "autamedica-secondary": "var(--secondary)",
        "autamedica-accent": "var(--accent)",
        "autamedica-text": "var(--text-primary)",
        "autamedica-text-secondary": "var(--text-secondary)",
        "autamedica-text-light": "var(--text-light)",
      },

      // Animaciones personalizadas para aplicaciones médicas
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'typing': 'typing 1.4s infinite ease-in-out',
        'popIn': 'popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'slideIn': 'slideIn 0.3s ease',
        'float': 'float 3s ease-in-out infinite',
      },

      // Keyframes para las animaciones personalizadas
      keyframes: {
        typing: {
          '0%, 80%, 100%': {
            transform: 'scale(1)',
            opacity: '0.5',
          },
          '40%': {
            transform: 'scale(1.3)',
            opacity: '1',
          },
        },
        popIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.3) translateY(20px)',
          },
          '70%': {
            transform: 'scale(1.05) translateY(-5px)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) translateY(0)',
          },
        },
        slideIn: {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      },
    },
  },
  plugins: []
};

export default config;