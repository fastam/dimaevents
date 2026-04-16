import { createRouter, createWebHistory } from "vue-router";
import EventsList from "./pages/EventsList.vue";
import EventDetail from "./pages/EventDetail.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: EventsList },
    { path: "/event/:id", component: EventDetail }
  ]
});