import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        purple: {
          50: { value: "#faf5ff" },
          100: { value: "#f3e8ff" },
          200: { value: "#e9d5ff" },
          500: { value: "#8b5cf6" },
          700: { value: "#6d28d9" },
          900: { value: "#4c1d95" },
        },
        gray: {
          50: { value: "#f9fafb" },
          500: { value: "#6b7280" },
        },
        orange: {
          200: { value: "#fed7aa" },
        },
        green: {
          200: { value: "#bbf7d0" },
        }
      }
    }
  }
})

export const system = createSystem(defaultConfig, config)
