import NewsForm from "@/views/news-form.vue";
import NewsList from "@/views/news-list.vue";
import NewsDetail from "@/views/news-detail.vue";

const routes = [
  {
    path: "/news/create",
    name: "NewsForm",
    component: NewsForm,
  },
  {
    path: "/news/",
    name: "NewsList",
    component: NewsList,
  },
  {
    path: "/news/:id",
    name: "NewsDetail",
    component: NewsDetail,
  },
];

export default routes;
