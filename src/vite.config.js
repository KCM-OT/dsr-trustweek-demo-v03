import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Demo runs fully offline from a local build — no proxy/network config needed.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    allowedHosts: ['.vercel.run'],
  },
})
