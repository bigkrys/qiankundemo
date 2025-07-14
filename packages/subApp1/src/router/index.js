import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  { path: '/', component: Home }
];

const router = createRouter({
  history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/subApp1/' : '/'),
  routes
});

export default router;