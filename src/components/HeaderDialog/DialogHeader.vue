<template>
  <q-card-section
    class="justify-between items-center text-white row"
    :class="backgroundClass"
  >
    <div class="q-mr-lg font-custom text-h5">{{ $t(props.option) }}</div>
    <q-icon
      name="close"
      class="cursor-pointer"
      size="20px"
      @click="emits('close', false)"
    />
  </q-card-section>
</template>

<script setup lang="ts">
const emits = defineEmits(["close"]);
const props = defineProps({
  option: {
    type: String,
    required: true,
  },
});

const layout = computed(() => getLayout());

const backgroundClass = computed(() => layoutsColors[layout.value]);
</script>
<style scoped>
.font-custom {
  font-family: Fira Sans;
}
</style>
