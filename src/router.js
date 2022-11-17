import { createRouter, createWebHistory } from "vue-router";

import Home from "./views/Home.vue";
import Faculty from "./views/Faculty.vue";
import Student from "./views/Student.vue";
import Judge from "./views/Judge.vue";
import NotFound from "./views/NotFound.vue";

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
