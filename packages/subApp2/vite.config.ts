import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import qiankun from 'vite-plugin-qiankun';
const useDevMode = process.env.NODE_ENV === 'development';
const host = 'localhost';
const port = 8002;
const subAppName = 'subApp2'; // 修改为与主应用配置一致

// https://vitejs.dev/config/
export default defineConfig({
  base: useDevMode ? `` : `/${subAppName}/`,
  // 确保生产环境资源路径正确映射到子应用路由
  plugins: [
    react(),
    qiankun(subAppName, { 
      useDevMode
    })
  ],
  resolve: {
    alias: {}
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
    rollupOptions: {},
  }
})
