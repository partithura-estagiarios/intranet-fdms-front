<template>
  <q-card
    class="pdf-card cursor-pointer bg-grey-2 flex column items-center q-pa-sm"
    :class="activeClass"
    flat
    @click="$emit('select', pdf)"
    @dblclick.stop="$emit('open', pdf)"
  >
    <q-icon name="img:ico/icons8-pdf-80.png" size="4rem" />

    <div class="text-bold text-h6 q-mt-sm text-center" :title="pdf.name">
      {{ displayTitle }}
    </div>

    <div class="text-bold text-caption text-center">
      {{ pdf.description }}
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { formatFileName } from "../lib";

const props = defineProps({
  pdf: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["select", "open"]);

const activeClass = computed(() => {
  return props.isSelected ? "selected-item" : "";
});

const displayTitle = computed(() => {
  if (!props.pdf.identifier && !props.pdf.description) {
    return formatFileName(props.pdf.name);
  }
  return props.pdf.identifier;
});
</script>

<style scoped>
.pdf-card {
  color: #3d45b9;
  cursor: default !important;
}

.selected-item {
  border: #6469b9 1px solid;
  border-radius: 8px;
}
</style>
