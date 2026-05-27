<template>
  <q-btn
    v-if="getUser.auth.isAdmin"
    color="white"
    icon="admin_panel_settings"
    flat
    size="1.5rem"
    to="/admin-settings"
  >
    <q-tooltip> Configurações de administrador</q-tooltip>
  </q-btn>
  <q-btn
    v-if="router.currentRoute.value.path != '/login'"
    color="white"
    :icon="authIcon"
    flat
    size="1.5rem"
    @click="handleAuthClick"
  />
</template>

<script setup lang="ts">
import { useUsers } from "../../../stores/user";
import { router } from "../../../modules";
const userStorage = useUsers();

const authIcon = computed(() => (userStorage.getToken ? "logout" : "login"));

const getUser = computed(() => userStorage.stateUser);

function handleAuthClick() {
  if (userStorage.getToken) {
    return userStorage.logout();
  }
  return router.push("/login");
}
</script>
<style scoped>
.my-card {
  top: 4.7rem;
  position: absolute;
  right: 0.8rem;
  width: 10.4rem;
  z-index: 1000 !important;
  clip-path: polygon(
    80.5% 0,
    85% 14%,
    100% 14%,
    100% 100%,
    0 100%,
    0 15%,
    76% 14%
  );

  height: 4rem;
}
.border-custom-card {
  top: 4.4rem;
  right: 0.6rem;
  width: calc(100% + 5.2rem);
  height: calc(100% - 1.35rem);
  position: absolute;
  z-index: 999;
  clip-path: polygon(
    79.5% 0,
    84% 14%,
    100% 14%,
    100% 100%,
    0 100%,
    0 15%,
    75% 14%
  );
}
.second-border-custom-card {
  top: 4.2rem;
  right: 0.5rem;
  width: calc(100% + 5.7rem);
  height: calc(100% + -1rem);
  position: absolute;
  z-index: 998;
  clip-path: polygon(
    79.9% 0,
    85% 13%,
    100% 14%,
    100% 100%,
    2% 100%,
    2% 15%,
    75% 14%
  );

  background-color: white;
}

.custom-font {
  font-family: Fira Sans;
  display: flex;
}

.position-btn {
  top: 0.17rem;
  right: 0.3rem;
}
</style>
