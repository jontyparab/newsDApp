import NewsList from '@/views/news-list.vue';
import NewsDetail from '@/views/news-detail.vue';

const routes = [
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: NewsDetail,
    props: (route) => {
      return {
        id: Number(route.params.id),
      };
    },
  },
  {
    path: '/news/',
    name: 'NewsList',
    component: NewsList,
  },
];

export default routes;
