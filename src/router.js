import { createRouter, createWebHistory } from "vue-router";

const Home = () => import("./views/Home.vue");
const Faculty = () => import("./views/Faculty.vue");
const Student = () => import("./views/Student.vue");
const Judge = () => import("./views/Judge.vue");
const NotFound = () => import("./views/NotFound.vue");

import store from "./store";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/faculty",
      component: Faculty,
      meta: { requiresAuth: true },
    },
    {
      path: "/student",
      component: Student,
      meta: { requiresAuth: true },
    },
    {
      path: "/judge",
      component: Judge,
      meta: { requiresAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      component: NotFound,
    },
  ],
});

router.beforeEach((to, _) => {
  if (to.meta.requiresAuth && !store.state.user) {
    return { path: "/" };
  } else if (store.state.user && to.path != `/${store.state.user.type}`) {
    return { path: `/${store.state.user.type}` };
  }
});

export default router;
