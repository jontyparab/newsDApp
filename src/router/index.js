import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/home-page.vue';
import newsRoutes from './routes/news/index';
import userRoutes from './routes/user/index';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
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
