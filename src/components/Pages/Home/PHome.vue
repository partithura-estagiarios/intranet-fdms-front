<template>
  <div>
    <q-img
      :height="cironHeightImg"
      fetchpriority="high"
      :src="elyteBackground"
    />
    <Separator :texto="$t('text.systems')" />
    <Item sistema="gestao" class="item-gestao" />
  </div>
</template>

<script setup lang="ts">
const layout = computed(() => getLayout());

const cironHeightImg = computed(() => (layout.value == "CIRON " ? "28em" : ""));
const elyteBackground = computed(() =>
  layout.value === "ELYTE" ? "/elyte-bg.avif" : "/WELCOME_INTRANET.avif",
);
</script>

<style scoped></style>
