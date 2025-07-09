/* eslint-disable @typescript-eslint/no-explicit-any */

import './App.css'
import React from 'react';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { microApps } from './microApps'
const { Header, Content, Footer, Sider } = Layout;

const items = [
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
  {
    key: '/main',
    icon: <UploadOutlined />,
    label: '主应用内容',
  },
];

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={({ key }) => {
            console.log('key', key)
            navigate(key)
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              <Route path="/subApp1" element={<div id="subAppContainer" style={{ height: '100%' }} />} />
              <Route path="/subApp2" element={<div id="subAppContainer" style={{ height: '100%' }} />} />
              <Route path="/main" element={<div>主应用内容</div>} />
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
