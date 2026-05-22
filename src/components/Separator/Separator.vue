<template>
  <q-separator :class="separatorClass" size="1vh" />
  <img :src="separatorImage" :class="layout === 'CIRON' && 'separator-class'" />
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
const emits = defineEmits(["receveid", "activeBadgeExclusion"]);
const props = defineProps({
  texto: {
    type: String,
    required: true,
  },
});
const layout = computed(() => getLayout());

const separatorImage = computed(() =>
  layout.value === "CIRON" ? "/SEPARATOR_CIRON.png" : "/SEPARATOR.png",
);

const separatorClass = computed(() =>
  layout.value === "CIRON" ? "color-separator-ciron" : "color-separator",
);
</script>

<style scoped>
.color-separator {
  background-color: rgba(0, 152, 1, 255);
}

.color-separator-ciron {
  background-color: #ff5700;
}

.separator-class {
  width: 23%;
}

.position-text {
  font-family: Fira Sans;
  bottom: 6.5rem;
  position: relative;
}
</style>
