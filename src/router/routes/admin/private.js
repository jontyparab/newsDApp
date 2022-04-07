import AdminBase from '@/views/admin/admin-base.vue';
import NewsAdminForm from '@/views/admin/news-admin-form.vue';
import NewsAdminList from '@/views/admin/news-admin-list.vue';
import NewsAdminDetail from '@/views/admin/news-admin-detail.vue';

const routes = [
  {
    path: '/admin',
    name: 'AdminBase',
    component: AdminBase,
    children: [
      {
        path: 'news',
        name: 'NewsAdminList',
        component: NewsAdminList,
      },
      {
        path: 'news/create',
        name: 'NewsAdminForm',
        component: NewsAdminForm,
      },
      {
        path: 'news/:id',
        name: 'NewsAdminDetail',
        component: NewsAdminDetail,
      },
    ],
  },
];

export default routes;
