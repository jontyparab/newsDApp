import NewsList from '@/views/news-list.vue';
import NewsDetail from '@/views/news-detail.vue';

const routes = [
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: NewsDetail,
    props: true,
  },
  {
    path: '/news/',
    name: 'NewsList',
    component: NewsList,
  },
];

export default routes;
