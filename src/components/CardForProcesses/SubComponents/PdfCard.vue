<template>
  <q-card
    class="flex items-center bg-grey-2 cursor-pointer pdf-card column q-pa-sm"
    flat
    @click="$emit('open', pdf)"
  >
    <q-icon name="img:ico/icons8-pdf-80.png" size="4rem" />

    <div class="q-mt-sm text-bold text-h6 text-center" :title="pdf.name">
      {{ displayTitle }}
    </div>

    <div class="text-bold text-caption text-center">
      {{ pdf.description }}
    </div>

    <q-menu v-if="useUser.getToken" context-menu touch-position>
      <q-list>
        <q-item clickable v-close-popup @click="$emit('edit', pdf)">
          <q-item-section avatar class="q-pr-sm min-w-0">
            <q-icon name="edit" color="primary" size="sm" />
          </q-item-section>
          <q-item-section class="text-black text-body2">{{
            $t("action.edit")
          }}</q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-close-popup @click="$emit('delete', pdf)">
          <q-item-section avatar class="q-pr-sm min-w-0">
            <q-icon name="delete" color="negative" size="sm" />
          </q-item-section>
          <q-item-section class="text-negative text-body2">{{
            $t("action.delete")
          }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-card>
</template>

<script setup lang="ts">
import { formatFileName } from "../lib";

const useUser = useUsers();

const props = defineProps({
  pdf: {
    type: Object,
    required: true,
  },
});

defineEmits(["open", "edit", "delete"]);

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
  transition:
    background-color 0.15s ease,
    transform 0.1s ease;
}

.pdf-card:hover {
  background: #e0e0e0 !important;
}

.pdf-card:active {
  background: #d0d0d0 !important;
  transform: scale(0.98);
}
</style>
