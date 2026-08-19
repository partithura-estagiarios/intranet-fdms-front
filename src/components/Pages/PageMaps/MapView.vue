<template>
  <Separator :texto="$t('tab.map')" />
  <div class="map-outline">
    <MapaPatioGeral />
  </div>
</template>
<style lang="scss" scoped>
.map-outline {
  margin: 32px auto;
  max-width: 1000px;
}
</style>
