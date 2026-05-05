<template>
  <q-separator class="color-separator" size="1vh" />
  <img src="/SEPARATOR.png" />
  <h4 class="text-bold text-white position-text">
    {{ texto }}
    <span v-if="userStorage.getToken" class="no-padding no-border">
      <ItemSystem v-if="router.fullPath === '/home'" />
      <IconOpts v-if="router.fullPath === '/institutional'" />
      <IconOptsCert v-if="router.fullPath === '/certifications'" />
    </span>
  </h4>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useUsers } from "../../stores";

const userStorage = useUsers();
const router = useRoute();
const exceptionRoutes = ["/home"];
const showTabHeader = computed(() => {
  return !exceptionRoutes.some((route) => router.fullPath.includes(route));
});
const emits = defineEmits(["receveid", "activeBadgeExclusion"]);
const props = defineProps({
  texto: {
    type: String,
    required: true,
  },
});
</script>
<style scoped>
.color-separator {
  background-color: rgba(0, 152, 1, 255);
}
.position-text {
  font-family: Fira Sans;
  bottom: 6.5rem;
  position: relative;
}
</style>
