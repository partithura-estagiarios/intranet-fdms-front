<template>
  <div>
    <q-img :height="imageHeight" fetchpriority="high" :src="backgroundImage" />
    <Separator :texto="$t('text.systems')" />
    <Item sistema="gestao" class="item-gestao" />
  </div>
</template>

<script setup lang="ts">
const layout = computed(() => getLayout());

const imageHeight = computed(() => (layout.value == "CIRON " ? "28em" : ""));
const backgroundImage = computed(() =>
  layout.value === "ELYTE" ? "/elyte-bg.avif" : "/WELCOME_INTRANET.avif",
);
</script>

<style scoped></style>
