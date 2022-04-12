import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/home-page.vue';
import adminRoutes from './routes/admin/index';
import newsRoutes from './routes/news/index';
import userRoutes from './routes/user/index';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
    redirect: { name: 'NewsList' },
  },
]
  .concat(newsRoutes)
  .concat(userRoutes)
  .concat(adminRoutes);

const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  routes: routes,
});

// router.beforeEach(function (to, from, next) {
//   if (!store.getters.isLoggedIn) {
//     store.dispatch('tryLogin');
//   }

//   if (to.meta.requiresAuth && !store.getters.isLoggedIn) {
//     next({ name: 'Auth' });
//   } else if (to.meta.requiresUnauth && store.getters.isLoggedIn) {
//     next({ name: 'WorkerList' });
//   } else {
//     next();
//   }
// });

export default router;
