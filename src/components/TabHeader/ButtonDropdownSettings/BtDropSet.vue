<template>
  <q-btn
    v-if="router.currentRoute.value.path != '/login'"
    color="white"
    :icon="userStorage.getToken ? 'logout' : 'login'"
    flat
    size="1.5rem"
    @click="handleLogOff(text)"
  />

  <!-- <q-card class="my-card bordered-card" v-show="card">
    <q-card-actions vertical align="center">
      <q-item
        class="q-px-sm position-btn"
        clickable
        @click="handleLogOff(text)"
        v-close-popup
      >
        <q-icon
          name="login"
          size="1.6rem"
          class="q-px-sm q-py-xs"
          :color="userStorage.getToken ? 'red' : 'indigo-5'"
        />
        <div
          class="q-py-xs text-no-wrap custom-font"
          :class="userStorage.getToken ? 'text-red' : 'text-indigo'"
        >
          <q-item-section>{{
            $t(`${userStorage.getToken ? "action.logout" : "action.login"}`)
          }}</q-item-section>
        </div>
      </q-item>
    </q-card-actions>
  </q-card> -->
  <!-- <div
    class="border-custom-card"
    :class="userStorage.getToken ? 'bg-red' : 'bg-indigo'"
    v-show="card"
  ></div>
  <div class="second-border-custom-card" v-show="card"></div> -->
</template>

<script setup lang="ts">
import { useUsers } from "../../../stores/user";
import { router } from "../../../modules";
const userStorage = useUsers();
const text = ref("");
const card = ref(false);

function handleLogOff(val: String) {
  card.value = !card.value;
  if (val.includes("login")) {
    return userStorage.login();
  }

  return userStorage.logout();
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
