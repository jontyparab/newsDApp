import NewsForm from '@/views/news-form.vue';

const routes = [
  {
    path: '/news/create',
    name: 'NewsForm',
    component: NewsForm,
    meta: {},
  },
];

routes.forEach((route) => {
  route['meta']['requiresAuth'] = true;
});

export default routes;
