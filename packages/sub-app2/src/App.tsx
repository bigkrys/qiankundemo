import './App.css'
import { MainEventBus, EVENT_MESSAGE_NAME } from '@myqiankun/utils';
import { useState, useEffect } from 'react';
// @ts-expect-error 使用事件总线
const eventBus = window.mainEventBus;

const sendMessageToMain = () => {
  eventBus.$emit(EVENT_MESSAGE_NAME.SUB2_SEND_MESSAGE, '子应用2向主应用发送消息');
}

const sendMessageToOther = () => {
  eventBus.$emit(EVENT_MESSAGE_NAME.SUB2_SEND_MESSAGE, '子应用2向其他应用发送消息');
}

function App() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // 监听来自主应用的消息
    const handleMainMessage = (eventName: string, msg: string) => {
      setMessages(prev => [...prev, msg]);
    };

    // 监听来自子应用1的消息
    const handleSub1Message = (eventName: string, msg: string) => {
      setMessages(prev => [...prev, msg]);
    };

    // 注册事件监听
    eventBus.$on(EVENT_MESSAGE_NAME.MAIN_SEND_MESSAGE, handleMainMessage);
    eventBus.$on(EVENT_MESSAGE_NAME.SUB1_SEND_MESSAGE, handleSub1Message);

    // 清理函数
    return () => {
      eventBus.$off(EVENT_MESSAGE_NAME.MAIN_SEND_MESSAGE, handleMainMessage);
      eventBus.$off(EVENT_MESSAGE_NAME.SUB1_SEND_MESSAGE, handleSub1Message);
    };
  }, [eventBus]);

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ 
        border: '1px solid #d9d9d9', 
        borderRadius: '6px', 
        padding: '16px',
        backgroundColor: '#fafafa'
      }}>
        <h2 style={{ margin: '0 0 16px 0', color: '#1890ff' }}>子应用2</h2>
        
        <div style={{ marginBottom: '16px' }}>
          <button 
            onClick={sendMessageToMain}
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              marginRight: '8px',
              cursor: 'pointer'
            }}
          >
            给主应用发送消息
          </button>
          <button 
            onClick={sendMessageToOther}
            style={{
              backgroundColor: '#52c41a',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              marginRight: '8px',
              cursor: 'pointer'
            }}
          >
            给其他应用发送消息
          </button>
          <button 
            onClick={clearMessages}
            style={{
              backgroundColor: '#ff4d4f',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            清空消息
          </button>
        </div>
        
        <div style={{ borderTop: '1px solid #d9d9d9', paddingTop: '16px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>子应用2收到的消息:</h3>
          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            padding: '12px',
            minHeight: '100px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {messages.length === 0 ? (
              <p style={{ color: '#999', margin: 0 }}>暂无消息</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {messages.map((msg: string, index: number) => (
                  <li key={index} style={{ marginBottom: '4px' }}>{msg}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
