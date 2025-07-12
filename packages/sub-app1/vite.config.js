import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun';

const mode = process.env.NODE_ENV || 'development';
const useDevMode = mode === 'development';
const host = '127.0.0.1';
const port = 8001;
const subAppName = 'subApp1'; // 这里 subAppName 对应 createBrowserRouter 的 basename
const base = useDevMode
  ? `http://${host}:${port}/${subAppName}`
  : `/${subAppName}`; // 这里 subAppName 对应 createBrowserRouter 的 basename

export default defineConfig({
  plugins: [
    vue(),
    qiankun(subAppName, {useDevMode, base, entry: 'src/main.js'}),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@myqiankun/utils': fileURLToPath(new URL('../../shared/utils/src/index.ts', import.meta.url))
    },
  },
  server: {
    port: 8001,
    host: 'localhost',
    cors: true,// 作为子应用，需要配置跨域
    open: true,
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
