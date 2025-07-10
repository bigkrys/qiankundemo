import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import qiankun from 'vite-plugin-qiankun';

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
  }
})
