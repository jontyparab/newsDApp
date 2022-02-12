import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import newsRoutes from './routes/news/index';
import userRoutes from './routes/user/index';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
]
  .concat(newsRoutes)
  .concat(userRoutes);

const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  routes: routes,
});

export default router;
