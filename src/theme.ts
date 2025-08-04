import { createSystem, defaultConfig } from "@chakra-ui/react";

// Professional ValveChain color scheme and theme
const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        // Deep Blue (Primary)
        deepBlue: {
          50: { value: "#f0f4ff" },
          100: { value: "#e0e9ff" },
          200: { value: "#c7d7fe" },
          300: { value: "#a5b8fc" },
          400: { value: "#8b8ff8" },
          500: { value: "#7c6aef" },
          600: { value: "#6b46e3" },
          700: { value: "#5b3cd4" },
          800: { value: "#4c32b3" },
          900: { value: "#1e3a8a" }, // Primary deep blue
        },
        // Silver Gray  
        silverGray: {
          50: { value: "#f8fafc" },
          100: { value: "#f1f5f9" },
          200: { value: "#e2e8f0" },
          300: { value: "#cbd5e1" },
          400: { value: "#94a3b8" },
          500: { value: "#64748b" },
          600: { value: "#475569" },
          700: { value: "#334155" },
          800: { value: "#1e293b" },
          900: { value: "#0f172a" },
        },
        // Copper (Industrial heritage)
        copper: {
          50: { value: "#fef7ed" },
          100: { value: "#fdedd5" },
          200: { value: "#fbd7aa" },
          300: { value: "#f8bc74" },
          400: { value: "#f59d3c" },
          500: { value: "#f28316" },
          600: { value: "#e3690c" },
          700: { value: "#bc4e0c" },
          800: { value: "#953d12" },
          900: { value: "#7a3212" },
        },
        // Emerald Green (Tech/Future accent)
        emeraldGreen: {
          50: { value: "#ecfdf5" },
          100: { value: "#d1fae5" },
          200: { value: "#a7f3d0" },
          300: { value: "#6ee7b7" },
          400: { value: "#34d399" },
          500: { value: "#10b981" },
          600: { value: "#059669" },
          700: { value: "#047857" },
          800: { value: "#065f46" },
          900: { value: "#064e3b" },
        },
        // Legacy colors for compatibility
        purple: {
          50: { value: "#f0f4ff" },
          100: { value: "#e0e9ff" },
          200: { value: "#c7d7fe" },
          300: { value: "#a5b8fc" },
          400: { value: "#8b8ff8" },
          500: { value: "#7c6aef" },
          600: { value: "#6b46e3" },
          700: { value: "#5b3cd4" },
          800: { value: "#4c32b3" },
          900: { value: "#1e3a8a" },
        },
        gray: {
          50: { value: "#f8fafc" },
          100: { value: "#f1f5f9" },
          200: { value: "#e2e8f0" },
          300: { value: "#cbd5e1" },
          400: { value: "#94a3b8" },
          500: { value: "#64748b" },
          600: { value: "#475569" },
          700: { value: "#334155" },
          800: { value: "#1e293b" },
          900: { value: "#0f172a" },
        },
        green: {
          50: { value: "#ecfdf5" },
          100: { value: "#d1fae5" },
          200: { value: "#a7f3d0" },
          300: { value: "#6ee7b7" },
          400: { value: "#34d399" },
          500: { value: "#10b981" },
          600: { value: "#059669" },
          700: { value: "#047857" },
          800: { value: "#065f46" },
          900: { value: "#064e3b" },
        },
        orange: {
          50: { value: "#fef7ed" },
          100: { value: "#fdedd5" },
          200: { value: "#fbd7aa" },
          300: { value: "#f8bc74" },
          400: { value: "#f59d3c" },
          500: { value: "#f28316" },
          600: { value: "#e3690c" },
          700: { value: "#bc4e0c" },
          800: { value: "#953d12" },
          900: { value: "#7a3212" },
        },
      },
      fonts: {
        heading: { value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
        body: { value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
      },
      spacing: {
        xs: { value: "0.5rem" },
        sm: { value: "0.75rem" },
        md: { value: "1rem" },
        lg: { value: "1.5rem" },
        xl: { value: "2rem" },
        "2xl": { value: "3rem" },
        "3xl": { value: "4rem" },
      },
    },
  },
});

export default system;
