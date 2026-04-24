import { defineConfig } from 'vite'

function react() {
  return {
    name: 'react-jsx-runtime',
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
