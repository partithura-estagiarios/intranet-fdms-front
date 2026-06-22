<template>
  <Separator :texto="$t('tab.processes')" class="spacing" />
  <Card class="spacing-card" />
</template>
<style scoped>
.spacing-card {
  margin-inline: 12rem;
  position: relative;
  margin-top: -0.5rem;
}

@media (max-width: 1439px) {
  .spacing-card {
    margin-inline: 4rem;
  }
}

@media (max-width: 1023px) {
  .spacing-card {
    margin-inline: 0.75rem;
  }
}
</style>
