import { defineStore } from "pinia";
import GetUser from "../graphql/user/queries.gql";
import GetAllUsers from "../graphql/user/GetAllUsers.gql";
import DeleteUser from "../graphql/user/DeleteUser.gql";

import { User } from "../entities/login";
import { router } from "../modules";
import { Auth } from "../entities/login";
const id = "users";

const API_URL =
  import.meta.env.VITE_APP_ENDPOINT || "http://localhost:3500/graphql";

async function runMutation<T>(
  mutationQuery: string,
  variables?: any,
): Promise<T> {
  const token = useUsers().stateUser.auth.token;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({
      query: mutationQuery,
      variables: variables,
    }),
  });

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

const userStorage: Auth = {
  auth: {
    id: "",
    name: "",
    password: "",
    email: "",
    token: "",
    isAdmin: null,
    ramal_number: null,
    user_registration: null,
  },
};

const DeleteUserMutation = `
  mutation DeleteUser($id: ID!) {
    deleteUser(deleteUserId: $id) {
      success
      message
    }
  }
`;

const Register = `
  mutation Register($newUser: NewUser!) {
    register(newUser: $newUser) {
      success
      message
      data {
        email
        isAdmin
        name
      }
    }
  }
`;

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
        password: form.labelInputPassword!,
        email: form.labelEmail!,
      });
      return userData;
    },
    getAllUsers: async () => {
      const data = await runQuery<{ users: any[] }>(GetAllUsers, null);
      return data.users;
    },

    deleteUser: async (id: string) => {
      const data = await runMutation<{
        deleteUser: { success: boolean; message: string };
      }>(DeleteUserMutation, { id });
      return data.deleteUser;
    },

    AddNewUser: async (userData: any) => {
      const data = await runMutation<{
        register: { success: boolean; message: string };
      }>(Register, {
        newUser: userData,
      });

      return data.register;
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
