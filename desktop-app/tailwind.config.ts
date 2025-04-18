import type { Config } from 'tailwindcss'
import shadcnPreset from '@shadcn/ui/tailwind-preset'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  corePlugins: { preflight: true },
  presets: [shadcnPreset],
}

export default config
