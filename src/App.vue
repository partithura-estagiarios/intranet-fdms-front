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
const currentRoute = useRoute();

const exceptionRoutes = ["/login"];

const showTabHeader = computed(() => {
  return !exceptionRoutes.some((route) => currentRoute.path.includes(route));
});
</script>
