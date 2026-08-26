/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Served today from the project page (janezomgzomg.github.io/janemendonca/),
  // not the repo root — assets need this prefix to resolve. Once the custom
  // domain (janemendonca.com) is live and serving from root, change this
  // back to '/'; App.tsx's router basename follows this automatically.
  base: '/janemendonca/',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
  },
})
