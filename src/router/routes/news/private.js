import NewsForm from '@/views/news-form.vue';
import NewsOwnedList from '@/views/news-owned-list.vue';

const routes = [
  {
    path: '/news/create',
    name: 'NewsForm',
    component: NewsForm,
    meta: {},
  },
  {
    path: '/news/my',
    name: 'NewsOwnedList',
    component: NewsOwnedList,
    meta: {},
  },
];

routes.forEach((route) => {
  route['meta']['requiresAuth'] = true;
});

export default routes;
