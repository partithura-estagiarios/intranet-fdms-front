<template>
  <EditFolder
    v-if="item.type === 'folder'"
    :folder="item"
    @close="$emit('close')"
  />

  <EditFile v-else :file="item" @close="$emit('close')" />
</template>

<script setup lang="ts">
const emit = defineEmits(["close"]);
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>
