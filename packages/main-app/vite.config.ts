import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@myqiankun/utils': fileURLToPath(new URL('../../shared/utils/src/index.ts', import.meta.url))
    }
  },
  server: {
    port: 8000,
    host: 'localhost',
    cors: true,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      external: ['@myqiankun/utils'],
      output: {
        globals: {
          '@myqiankun/utils': 'MyQiankunUtils'
        }
      }
    }
  }
})
