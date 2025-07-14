const senMessageToMain = () => {
}
const senMessageToOther = () => {
  
}

export const Home = () => {
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
