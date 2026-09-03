import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Demo runs fully offline from a local build — no proxy/network config needed.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    // `true` = accept any Host header. The previous ['.vercel.run'] allowlist
    // made the v0 preview panel show a blank frame, because Vite answers a
    // proxied hostname it doesn't recognise with a 403 "Blocked request"
    // instead of the app. Dev-server only; has no effect on the deployed
    // build, which is static files behind Vercel's own routing.
    allowedHosts: true,
  },
})
