import { createRouter, createWebHistory } from "vue-router";
import { useUsers } from "../stores";
import routes from "~pages";
import { warningNotify } from "../helpers";

const history = createWebHistory();

export const router = createRouter({
  history,
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const userStorage = useUsers();
  if (userStorage.stateUser.auth.token && to.path === "/login") {
    warningNotify("Você já está logado");
    return next("/home");
  }
  return next();
});
