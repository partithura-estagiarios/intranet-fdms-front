import { defineStore } from "pinia";
import GetUser from "../graphql/user/queries.gql";
import { User } from "../entities/login";
import { router } from "../modules";
import { Auth } from "../entities/login";
const id = "users";

const userStorage = {
  auth: { id: "", name: "", password: "", email: "", token: "" },
};

export const useUsers = defineStore(id, {
  state: () => {
    return {
      stateUser: { ...userStorage },
    };
  },
  getters: {
    getToken: (state) => {
      return state.stateUser.auth.token;
    },
  },
  actions: {
    getUser: async (form: User): Promise<Auth> => {
      const userData = await runQuery<Auth>(GetUser, {
        name: form.labelInputName!,
        password: form.labelInputPassword!,
        email: form.labelEmail!,
      });
      return userData;
    },
    logout() {
      this.$reset();

      try {
        localStorage.removeItem(this.$id);
      } catch {
        // ignore (e.g., SSR or restricted storage)
      }

      return router.replace("/login");
    },
    login() {
      return router.replace("/home");
    },
  },
  persist: true,
});
