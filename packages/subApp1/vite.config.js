import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun';

const useDevMode = process.env.NODE_ENV === 'development';
const host = '127.0.0.1';
const port = 8001;
const subAppName = 'subApp1'; // 统一路径格式与Nginx保持一致
const base = useDevMode
  ? `http://${host}:${port}/`
  : `/${subAppName}`; // 这里 subAppName 对应 createBrowserRouter 的 basename

export default defineConfig({
  base: useDevMode ? '' : `/${subAppName}`,
  plugins: [
    vue(),
    qiankun(subAppName, {useDevMode, base, entry: 'src/main.js'}),
  ],
  resolve: {
  },
  server: {
    port: 8001, // 本地环境独立启动
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
  },
})
