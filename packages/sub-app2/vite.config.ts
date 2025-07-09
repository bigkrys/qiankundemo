import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import qiankun from 'vite-plugin-qiankun';

const mode = 'development';
const useDevMode = mode === 'development';
const host = '127.0.0.1';
const port = 8002;
const subAppName = 'subApp2'; // 这里 subAppName 对应 createBrowserRouter 的 basename
const base = useDevMode
  ? `http://${host}:${port}/${subAppName}`
  : `/${subAppName}`; // 这里 subAppName 对应 createBrowserRouter 的 basename

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    qiankun(subAppName, {useDevMode, base, entry: 'src/main.tsx'}),
  ],
 server: {
    port: 8002,
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
})
