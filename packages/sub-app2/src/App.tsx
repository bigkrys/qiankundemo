import './App.css'
import { MainEventBus, EVENT_MESSAGE_NAME } from '@myqiankun/utils';
// @ts-expect-error 使用事件总线
const eventBus = window.mainEventBus;
const senMessageToMain = () => {
  eventBus.$emit(EVENT_MESSAGE_NAME.MAIN_SEND_MESSAGE, '子应用2向主应用发送消息');
}
const senMessageToOther = () => {
  eventBus.$emit(EVENT_MESSAGE_NAME.SUB2_SEND_MESSAGE, '子应用2向其他应用发送消息');
}
function App() {

  return (
    <>
      <div>
        <h2>子应用2</h2>
        <button onClick={senMessageToMain}>给主应用发送消息</button>
        <button style={{marginLeft: '8px'}} onClick={senMessageToOther}>给其他应用发送消息</button>
      </div>
    </>
  )
}

export default App
