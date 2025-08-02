import { createSystem, defaultConfig } from "@chakra-ui/react";

// Create a simple system for Chakra UI v3
const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        purple: {
          50: { value: "#f7fafc" },
          100: { value: "#edf2f7" },
          200: { value: "#e2e8f0" },
          300: { value: "#cbd5e0" },
          400: { value: "#a0aec0" },
          500: { value: "#718096" },
          600: { value: "#4a5568" },
          700: { value: "#2d3748" },
          800: { value: "#1a202c" },
          900: { value: "#171923" },
        },
        gray: {
          50: { value: "#f7fafc" },
          100: { value: "#edf2f7" },
          200: { value: "#e2e8f0" },
          300: { value: "#cbd5e0" },
          400: { value: "#a0aec0" },
          500: { value: "#718096" },
          600: { value: "#4a5568" },
          700: { value: "#2d3748" },
          800: { value: "#1a202c" },
          900: { value: "#171923" },
        },
        green: {
          50: { value: "#f0fff4" },
          100: { value: "#c6f6d5" },
          200: { value: "#9ae6b4" },
          300: { value: "#68d391" },
          400: { value: "#48bb78" },
          500: { value: "#38a169" },
          600: { value: "#2f855a" },
          700: { value: "#276749" },
          800: { value: "#22543d" },
          900: { value: "#1c4532" },
        },
        orange: {
          50: { value: "#fffaf0" },
          100: { value: "#feebc8" },
          200: { value: "#fbd38d" },
          300: { value: "#f6ad55" },
          400: { value: "#ed8936" },
          500: { value: "#dd6b20" },
          600: { value: "#c05621" },
          700: { value: "#9c4221" },
          800: { value: "#7b341e" },
          900: { value: "#652b19" },
        },
      },
    },
  },
});

export default system;
