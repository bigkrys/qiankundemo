import './public-path'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import {
  qiankunWindow,
  renderWithQiankun,
} from 'vite-plugin-qiankun/dist/helper';

let appInstance = null;

/** 渲染函数 */
const render = (props = {}) => {
  const { container, routeType, baseUrl, initialQuery, userInfo } = props;
  appInstance = createApp(App);
  console.log('routeType', routeType);
  console.log('baseUrl', baseUrl);
  console.log('initialQuery', initialQuery);
  console.log('userInfo', userInfo);
  // 挂载到 qiankun 容器或默认 #app
  appInstance.mount(container ? container.querySelector('#subApp1') : '#subApp1');
};

/** Qiankun 生命周期钩子 */
const qiankun = () => {
  renderWithQiankun({
    bootstrap() {},
    async mount(props) {
      render(props);
    },
    update: () => {},
    async unmount(props) {
      
    },
  });
};

// 检查是否在 Qiankun 环境中
console.log('qiankunWindow', qiankunWindow.__POWERED_BY_QIANKUN__);

if (qiankunWindow.__POWERED_BY_QIANKUN__) {
  qiankun(); // 以子应用的方式启动
} else {
  render(); // 独立运行
}
