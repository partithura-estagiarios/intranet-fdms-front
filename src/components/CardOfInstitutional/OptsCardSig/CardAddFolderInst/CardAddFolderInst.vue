<template>
  <q-dialog v-model="props.card">
    <q-card class="my-card">
      <DialogHeader @close="closeDialog" :option="$t('action.addFolder')" />

      <q-card-section
        ><q-input v-model="nameFolder" :label="$t('action.writeFolder')" />
      </q-card-section>
      <q-card-section> </q-card-section>
      <CardButtonConfirm @confirm="addFolder()" />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useImgs } from "../../../../stores/imgs";

const { t } = useI18n();
const imgsStorage = useImgs();
const emits = defineEmits(["update-card-folder", "folder-created"]);
const nameFolder = ref();
function closeDialog() {
  emits("update-card-folder", false);
}
const props = defineProps({
  card: {
    type: Boolean,
    required: true,
  },
});
async function addFolder() {
  const result = await imgsStorage.insertFolder(nameFolder.value);
  if (result.success) {
    closeDialog();
    emits("folder-created");
    return positiveNotify(t(`action.${result.message}`));
  }
  negativeNotify(t(`action.${result.message}`));
  nameFolder.value = "";
}
</script>
