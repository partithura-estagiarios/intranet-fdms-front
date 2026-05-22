<template>
  <div>
    <q-img :src="backgroundSrc" />
    <Separator :texto="$t('text.systems')" />
    <Item sistema="gestao" class="item-gestao" />
  </div>
</template>

<script setup lang="ts">
const layout = computed(() => getLayout());

const backgroundSrc = computed(() =>
  layout.value === "CIRON" ? "/WELCOME_CIRON.png" : "/WELCOME_INTRANET.png",
);
</script>

<style scoped>
.item-gestao {
  margin-top: -6rem;
}
</style>
