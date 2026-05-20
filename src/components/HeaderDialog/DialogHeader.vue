<template>
  <q-card-section
    class="row items-center justify-between text-white"
    :class="backgroundClass"
  >
    <div class="text-h5 font-custom q-mr-lg">{{ $t(props.option) }}</div>
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

const layout = computed(() => {
  const value =
    (import.meta.env["LAYOUT"] as string | undefined) ??
    (import.meta.env["VITE_LAYOUT"] as string | undefined) ??
    "FUNDIMISA";

  return value.trim().toUpperCase();
});

const backgroundClass = computed(() =>
  layout.value === "CIRON" ? "bg-black" : "custom-color",
);
</script>
<style scoped>
.font-custom {
  font-family: Fira Sans;
}
.custom-color {
  background-color: rgb(31, 73, 125);
}
</style>
