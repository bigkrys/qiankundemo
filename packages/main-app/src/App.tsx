/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
import React from 'react';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Divider, Button, Space, Card, List, Typography } from 'antd';
import { useNavigate, useLocation, Routes, Route,  } from 'react-router-dom';
// @ts-expect-error 使用事件总线
import { EVENT_MESSAGE_NAME, MessageData } from '@myqiankun/utils';
const { Header, Content, Footer } = Layout;
const { Text } = Typography;
import { useState, useEffect } from 'react';

const items = [
  {
    key: '/main',
    icon: <UploadOutlined />,
    label: '主应用内容',
  },
  {
    key: '/subApp1',
    icon: <UserOutlined />,
    label: '子应用1',
  },
  {
    key: '/subApp2',
    icon: <VideoCameraOutlined />,
    label: '子应用2',
  },
];

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [subApp1Messages, setSubApp1Messages] = useState<string[]>([]);
  const [subApp2Messages, setSubApp2Messages] = useState<string[]>([]);
  const [messageHistory, setMessageHistory] = useState<MessageData[]>([]);
  const globalState = useState({
    user: 'krys',
    legend: 'hello word',
  });

  // @ts-expect-error 使用事件总线
  const eventBus = window.mainEventBus;
  // @ts-expect-error 使用事件总线
  window.globalStore.globalState = globalState;

  useEffect(() => {
    // 监听子应用1的消息
    const handleSub1Message = (eventName: string, msg: string) => {
      setSubApp1Messages(prev => [...prev, msg]);
    };

    // 监听子应用2的消息
    const handleSub2Message = (eventName: string, msg: string) => {
      setSubApp2Messages(prev => [...prev, msg]);
    };

    // 注册事件监听
    eventBus.$on(EVENT_MESSAGE_NAME.SUB1_SEND_MESSAGE, handleSub1Message);
    eventBus.$on(EVENT_MESSAGE_NAME.SUB2_SEND_MESSAGE, handleSub2Message);

    // 定期更新消息历史
    const updateHistory = () => {
      const history = eventBus.getMessageHistory();
      setMessageHistory(history);
    };

    const historyInterval = setInterval(updateHistory, 1000);

    // 清理函数
    return () => {
      eventBus.$off(EVENT_MESSAGE_NAME.SUB1_SEND_MESSAGE, handleSub1Message);
      eventBus.$off(EVENT_MESSAGE_NAME.SUB2_SEND_MESSAGE, handleSub2Message);
      clearInterval(historyInterval);
    };
  }, [eventBus]);

  const sendMessageToSubApp1 = () => {
    eventBus.$emit(EVENT_MESSAGE_NAME.MAIN_SEND_MESSAGE, '主应用向子应用1发送消息');
  };

  const sendMessageToSubApp2 = () => {
    eventBus.$emit(EVENT_MESSAGE_NAME.MAIN_SEND_MESSAGE, '主应用向子应用2发送消息');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={items}
            onClick={({ key }) => {
              console.log('key', key)
              navigate(key)
            }}
          />
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}>
            <div style={{
              width: '200px'
            }}>
              主应用的state
              <p>用户名：{globalState[0].user}</p>
              <p>标签：{globalState[0].legend}</p>
            </div>

              <div style={{
                width: '400px'
              }}>
                <h3>主应用消息发送</h3>
                <div style={{
                  marginTop: '10px'
                }}>
                <Button type="primary" onClick={sendMessageToSubApp1}>向子应用1发送消息</Button>
                </div>
                <div style={{
                  marginTop: '10px'
                }}>
                <Button type="primary" onClick={sendMessageToSubApp2}>向子应用2发送消息</Button>
                </div>
                
              </div>
            
              <div style={{
                width: '400px'
              }}>
                子应用1的消息
                <ul>
                  {subApp1Messages.map((msg: string, index: number) => (
                    <li key={index}>{msg}</li>
                  ))}
                </ul>
              </div>

              <div style={{
                width: '400px'
              }}>
                子应用2的消息
                <ul>
                  {subApp2Messages.map((msg: string, index: number) => (
                    <li key={index}>{msg}</li>
                  ))}
                </ul>
              </div>
            </div>

            <Divider style={{ borderColor: '#7cb305' }}>分割线，用于区分主应用和子应用</Divider>
            <Routes>
              <Route path="/subApp1" element={<div id="subAppContainer" style={{ height: '100%' }} />} />
              <Route path="/subApp2" element={<div id="subAppContainer" style={{ height: '100%' }} />} />
              <Route path="/main" element={<div>这是主应用内容</div>} />
              <Route path="*" element={<div>请选择左侧菜单</div>} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          krys ©{new Date().getFullYear()} Created by krys
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
