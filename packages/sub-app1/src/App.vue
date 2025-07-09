<script setup>
import { MainEventBus, EVENT_MESSAGE_NAME } from '@myqiankun/utils';
import { onMounted, onUnmounted, ref } from 'vue';
// @ts-expect-error 使用事件总线
const eventBus = window.mainEventBus;
const sendMessageToMainApp = () => {
  eventBus.$emit(EVENT_MESSAGE_NAME.SUB1_SEND_MESSAGE, '子应用1向主应用发送消息');
};
const sendMessageToOtherSubApp = () => {
  eventBus.$emit(EVENT_MESSAGE_NAME.SUB1_SEND_MESSAGE, '子应用1向其他子应用发送消息');
};
let stateSubscriber;
onMounted(() => {
  eventBus.$on(EVENT_MESSAGE_NAME.SUB2_SEND_MESSAGE, (msg) => {
    messages.value.push(msg);
  });
   eventBus.$on(EVENT_MESSAGE_NAME.MAIN_SEND_MESSAGE, (msg) => {
    messages.value.push(msg);
  });
  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    console.log('params', params.get('tab'));
  });
  const formattedDate = window.sharedLib.utils.formatDate(new Date().toString());
  console.log('formattedDate', formattedDate);
  // const products = await window.sharedLib.services.api.getProducts();

  const currentState = window.globalStore.getState();

  // 订阅状态变化
  stateSubscriber = window.globalStore.subscribe(() => {
    const newState = window.globalStore.getState();
    console.log('newState', newState);
  });

  // 派发 action
  window.globalStore.dispatch({
    type: 'SET_USER',
    payload: { name: '王五', role: 'user' }
  });
});

onUnmounted(() => {
  stateSubscriber();
});

const messages = ref([]);
</script>

<template>
  <div>
    <h2>子应用1</h2>
    <button @click="sendMessageToMainApp">给主应用发送消息</button>
    <button @click="sendMessageToOtherSubApp" style="margin-left: 10px;">给其他子应用发送消息</button>
    <div>
      子应用1收到的消息:
      <ul>
        <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
