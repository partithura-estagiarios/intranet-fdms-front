<template>
  <div>
    <q-card-section align="right">
      <div class="font-custom">
        <q-btn
          :color="buttonColor"
          :label="$t('formRamal.confirm')"
          @click="$emit('confirm')"
        />
      </div>
    </q-card-section>
  </div>
</template>

<script setup lang="ts">
const layout = computed(() => getLayout());

const buttonColor = computed(() =>
  layout.value === "CIRON" ? "orange-14" : "green",
);
</script>
