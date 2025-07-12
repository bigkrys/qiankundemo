import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import qiankun from 'vite-plugin-qiankun';
import { fileURLToPath, URL } from 'node:url'

const mode = process.env.NODE_ENV || 'development';
const useDevMode = mode === 'development';
const host = '127.0.0.1';
const port = 8002;
const subAppName = 'sub-app2'; // 修改为与目录名一致

// https://vitejs.dev/config/
export default defineConfig({
  base: useDevMode ? `http://${host}:${port}/` : '/',
  plugins: [
    react(),
    qiankun(subAppName, { useDevMode })
  ],
  resolve: {
    alias: {
      '@myqiankun/utils': fileURLToPath(new URL('../../shared/utils/src/index.ts', import.meta.url))
    }
  },
  server: {
    port,
    host: 'localhost',
    cors: true,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
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
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})
