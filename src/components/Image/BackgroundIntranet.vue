<template>
  <q-img :src="backgroundSrc" class="absolute fixed-full background" />
</template>

<script setup lang="ts">
const layout = computed(() => {
  const value =
    (import.meta.env["LAYOUT"] as string | undefined) ??
    (import.meta.env["VITE_LAYOUT"] as string | undefined) ??
    "FUNDIMISA";

  return value.trim().toUpperCase();
});

const backgroundSrc = computed(() =>
  layout.value === "CIRON"
    ? "/BACKGROUND_CIRON.png"
    : "/INTRANET_BACKGROUND_ FUNDIMISA.png",
);
</script>

<style scoped>
.background {
  z-index: -1;
  opacity: 100%;
}
</style>
