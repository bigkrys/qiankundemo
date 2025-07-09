/* eslint-disable @typescript-eslint/no-explicit-any */

import './App.css'
import { useLayoutEffect, useRef } from 'react';
import { loadMicroApp } from 'qiankun';
import type { MicroApp } from 'qiankun';
import { microApps } from './microApps'
import { EVENT_MESSAGE_NAME } from '@myqiankun/utils';
/** 子应用样式 */
const subStyle = {
  width: 'calc((100% - 20px * 2) / 3)',
  height: 400,
  border: '1px solid red',
};
// @ts-expect-error 使用事件总线
let eventBus = window.mainEventBus;

function App() {
  const microInstanceRef = useRef<MicroApp>(undefined); // 子应用实例
  useLayoutEffect(() => {
    if (!eventBus) {
      // @ts-expect-error 使用事件总线
      eventBus = window.mainEventBus;
    }
    eventBus.$on(EVENT_MESSAGE_NAME.SUB1_SEND_MESSAGE, (data: any) => {
      console.log('主应用接受子应用1发送的消息', data);
    })
      eventBus.$on(EVENT_MESSAGE_NAME.SUB2_SEND_MESSAGE, (data: any) => {
      console.log('主应用接受子应用2发送的消息', data);
    })
  }, []);
  // 新增发送消息方法
const sendMessage1 = () => {
  // eventBus.$emit(EVENT_MESSAGE_NAME.MAIN_SEND_MESSAGE, '主应用向子应用发送消息1');
  history.pushState(null, '', `?app=dashboard&tab=analytics`);
}
const sendMessage2 = () => {
  eventBus.$emit(EVENT_MESSAGE_NAME.MAIN_SEND_MESSAGE, '主应用向子应用发送消息2');
}
const getQueryParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return Object.fromEntries(searchParams.entries());
};
  const handleClick = (appName: string) => {

    microInstanceRef.current?.unmount();
    console.log(microApps)
    const microApp = microApps.find((item) => item.name === appName);
    console.log('microApps', microApp, appName);

    const { ...rest } = microApp;

    microInstanceRef.current = loadMicroApp({
      ...rest,
      props: { 
        routeType: 'memory' ,
        baseUrl: window.location.href, // 传递完整URL
        initialQuery: getQueryParams(),
        userInfo: {
          name: '张三',
          age: 18,
        }
       }, // 设置路由类型为 memory
      
    });
  };
  return (
    <>
      <div>
        <h2>主应用</h2>
        <button onClick={() => handleClick('subApp1')}>加载 app1</button>
        <button onClick={() => handleClick('subApp2')}>加载 app2</button>
        <button onClick={() => sendMessage1()}>向app1发送消息</button>
        <button onClick={() => sendMessage2()}>向app2发送消息</button>
        <div style={{ display: 'flex', gap: '0 20px', width: '1800px'}}>
          <div id="subAppContainer1" style={subStyle}></div>
          <div id="subAppContainer2" style={subStyle}></div>
        </div>
      </div>
    </>
  )
}

export default App;
