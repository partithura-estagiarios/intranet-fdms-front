<template>
  <Separator :texto="$t('tab.institutional')" class="no-margin no-padding" />
  <div
    class="row"
    :class="$q.screen.lt.lg ? 'justify-between' : 'justify-center q-py-sm'"
  >
    <CardInstitutional />
  </div>
</template>

<style scoped></style>
