import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {
  qiankunWindow,
  renderWithQiankun,
} from 'vite-plugin-qiankun/dist/helper';
import type { QiankunProps } from 'vite-plugin-qiankun/dist/helper';
const render = (container?: HTMLElement) => {
  const app = container || document.getElementById('root2') as HTMLDivElement;
  console.log('hhhhhh',app)
  createRoot(app).render(
    <StrictMode>
      <App/>
    </StrictMode>,
  )
  
}
/** Qiankun 生命周期钩子 */
const qiankun = () => {
  renderWithQiankun({
    bootstrap() {},
    async mount(props: QiankunProps) {
      console.log('subapp2', props)
      render(props.container);
    },
    update: () => {},
    unmount: () => {
      
    }
  });
};


if (qiankunWindow.__POWERED_BY_QIANKUN__) {
  qiankun(); // 以子应用的方式启动
} else {
  render();
}
