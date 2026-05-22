<template>
  <q-img :src="backgroundSrc" class="fixed-full background" />
</template>

<script setup lang="ts">
const layout = computed(() => getLayout());

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
  background-repeat: repeat;
}
</style>
