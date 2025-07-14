import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {
  qiankunWindow,
  renderWithQiankun,
} from 'vite-plugin-qiankun/dist/helper';
import type { QiankunProps } from 'vite-plugin-qiankun/dist/helper';

let root: any = null;

const render = (container?: HTMLElement) => {
  const app = container || document.getElementById('root2') as HTMLDivElement;
  console.log('subApp2 render target:', app);
  
  if (root) {
    root.unmount();
  }
  
  root = createRoot(app);
  root.render(
    <StrictMode>
      <App/>
    </StrictMode>,
  )
}

/** Qiankun 生命周期钩子 */
const qiankun = () => {
  renderWithQiankun({
    bootstrap() {
      console.log('subApp2 bootstrap');
    },
    async mount(props: QiankunProps) {
      console.log('subApp2 mount', props);
      render(props.container);
    },
    update: () => {
      console.log('subApp2 update');
    },
    unmount: () => {
      console.log('subApp2 unmount');
      if (root) {
        root.unmount();
        root = null;
      }
    }
  });
};

// 判断是否在qiankun环境中
if (qiankunWindow.__POWERED_BY_QIANKUN__) {
  qiankun(); // 以子应用的方式启动
} else {
  render(); // 独立启动
}
