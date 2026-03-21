import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: __dirname,
  plugins: [react({ 
    jsxRuntime: 'automatic',
    babel: {
      plugins: []
    },
    // 禁用 Fast Refresh 避免构建问题
    fastRefresh: false
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: false,
  },
})
