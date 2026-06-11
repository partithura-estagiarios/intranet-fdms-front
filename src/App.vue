<template>
  <div>
    <BarUp />
    <BackgroundIntranet v-if="showTabHeader" />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { router } from "./modules";
const currentRoute = useRoute();
const userStore = useUsers();
const token = ref();

const exceptionRoutes = ["/login"];

const showTabHeader = computed(() => {
  return !exceptionRoutes.some((route) => currentRoute.path.includes(route));
});
onMounted(() => {
  token.value = userStore.getToken;
});

watch(
  token.value,
  (newVal) => {
    if (!newVal) router.push("/login");
  },
  { deep: true },
);
</script>
