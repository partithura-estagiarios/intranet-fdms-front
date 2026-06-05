<template>
  <div>
    <q-img
      :height="cironHeightImg"
      fetchpriority="high"
      src="/WELCOME_INTRANET.avif"
    />
    <Separator :texto="$t('text.systems')" />
    <Item sistema="gestao" class="item-gestao" />
  </div>
</template>

<script setup lang="ts">
const layout = computed(() => getLayout());

const cironHeightImg = computed(() => (layout.value == "CIRON " ? "28em" : ""));
</script>

<style scoped>
.item-gestao {
  margin-top: -6rem;
}
</style>
