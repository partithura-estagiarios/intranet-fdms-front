<template>
  <q-dialog v-model="props.card">
    <q-card class="my-card">
      <DialogHeader
        @close="closeDialog"
        :option="$t('action.deleteCertification')"
      />

      <q-card-section>
        <q-select
          v-model="select"
          :label="$t('text.file')"
          :options="imgsStorage.certifications"
          popup-content-class="force-light-menu"
          outlined
          color="primary"
        >
        </q-select>
      </q-card-section>
      <CardButtonConfirm @confirm="excludeCert()" />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useImgs } from "../../stores/imgs";

const imgsStorage = useImgs();

const emits = defineEmits(["update-card-folder"]);

const props = defineProps({
  card: {
    type: Boolean,
    required: true,
  },
});

const select = ref<string | null>(null);

function closeDialog() {
  select.value = null;
  emits("update-card-folder", false);
}

async function excludeCert() {
  if (select.value) {
    await imgsStorage.excludeCertification(select.value);
    closeDialog();
  }
}
</script>
<style>
.force-light-menu {
  background-color: white !important;
}

.force-light-menu .q-item__label {
  color: #000000 !important;
}

.force-light-menu .q-item.q-manual-focusable--focused .q-item__label,
.force-light-menu .q-item--active .q-item__label {
  color: #000000 !important;
}
</style>
