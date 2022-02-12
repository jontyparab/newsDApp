import NewsForm from "@/views/NewsForm.vue";
import NewsList from "@/views/NewsList.vue";
import NewsDetail from "@/views/NewsDetail.vue";

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
