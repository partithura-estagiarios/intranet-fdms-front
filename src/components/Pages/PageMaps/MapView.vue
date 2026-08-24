<template>
  <Separator :texto="$t('tab.map')" />
  <div class="row map-outline align-center justify-center">
    <div class="col-3">
      <MapModulesMenu />
    </div>
    <div class="col-9">
      <MapaPatioGeral />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.map-outline {
  margin-top: 32px;
}
</style>
