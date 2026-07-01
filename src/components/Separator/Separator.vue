<template>
  <q-separator :class="separatorClass" size="1vh" />
  <img :src="separatorImage" :class="layoutClass && 'separator-class'" />
  <h4 class="text-bold text-white position-text">
    {{ texto }}
    <span v-if="userStorage.getToken" class="no-border no-padding">
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
const emits = defineEmits(["receveid", "activeBadgeExclusion"]);
const props = defineProps({
  texto: {
    type: String,
    required: true,
  },
});
const layout = computed(() => getLayout());

const separatorImage = computed(() => {
  if (layout.value === "CIRON") return "/SEPARATOR_CIRON.png";
  if (layout.value === "ELYTE") return "/SEPARATOR-ELYTE.avif";
  return "/SEPARATOR.png";
});

const separatorClass = computed(() => {
  if (layout.value === "CIRON") return "color-separator-ciron";
  if (layout.value === "ELYTE") return "color-separator-elyte";
  return "color-separator";
});

const layoutClass = computed(() => {
  return layout.value === "CIRON" || layout.value === "ELYTE";
});
</script>

<style scoped>
.color-separator {
  background-color: rgba(0, 152, 1, 255);
}

.color-separator-ciron {
  background-color: #ff5700;
}

.color-separator-elyte {
  background-color: hsl(352.86deg 100% 50.59%);
}

.separator-class {
  width: 23%;
}

.position-text {
  font-family: Fira Sans;
  bottom: 6.5rem;
  position: relative;
  margin-bottom: -6.5rem;
}
</style>
