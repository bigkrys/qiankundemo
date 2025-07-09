/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createStore } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import { registerMicroApps, start } from 'qiankun';
import { microApps } from './microApps.ts'
import { SecureEventBus, EVENT_MESSAGE_NAME } from '@myqiankun/utils';
registerMicroApps(microApps, {
    beforeLoad: async (app) => {
      console.log(`%c before load: ${app.name}`, 'color: green');
    },
    beforeMount: async (app) => {
      console.log(`%c before mount: ${app.name}`, 'color: green');
    },
    afterMount: async (app) => {
      console.log(`%c after mount: ${app.name}`, 'color: yellow');
    },
    beforeUnmount: async (app) => {
      console.log(`%c before unmount: ${app.name}`, 'color: red');
    },
    afterUnmount: async (app) => {
      console.log(`%c after unmount: ${app.name}`, 'color: red');
    },
  }
);
// @ts-expect-error 注册事件总线
// window.mainEventBus = new MainEventBus();
window.mainEventBus = new SecureEventBus({
  subApp1: [
    EVENT_MESSAGE_NAME.SUB1_SEND_MESSAGE,
  ],
  subApp2: [
    EVENT_MESSAGE_NAME.SUB2_SEND_MESSAGE,
  ]
});

// 主应用创建共享库
// @ts-expect-error 共享数据
window.sharedLib = {
  utils: {
    formatDate: (date: string) => new Date(date).toLocaleDateString(),
    currencyFormat: (num: number) => `¥${num.toFixed(2)}`},
  services: {
    api: {
      getUser: () => fetch('/api/user'),
      getProducts: () => fetch('/api/products')
    }
  },
  constants: {
    MAX_ITEMS: 100,
    THEME_COLORS: ['#1890ff', '#52c41a', '#faad14']
  }
};

const globalReducer = (state: any, action: any) => {
  switch(action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'UPDATE_CONFIG':
      return { ...state, config: { ...state.config, ...action.payload } };
    default:
      return state;
  }
};
const globalStore = createStore(globalReducer)
// @ts-expect-error 共享数据
window.globalStore = globalStore;
start({singular: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)