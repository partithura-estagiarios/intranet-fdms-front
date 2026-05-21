<template>
  <q-dialog v-model="props.card">
    <q-card class="my-card">
      <DialogHeader @close="closeDialog" :option="$t('cardDocSig.addImg')" />
      <q-card-section>
        <SelectFolderForImg @envity-folder="(val: string) => (folder = val)" />
      </q-card-section>
      <q-card-section>
        <InputImg @envity-img="(val: File) => (img = val)" />
      </q-card-section>
      <CardButtonConfirm @confirm="addImg()" />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useImgs } from "../../../stores/imgs";

const imgsStorage = useImgs();
const props = defineProps({
  card: {
    type: Boolean,
    required: true,
  },
});
const { notifyResponse } = useNotify();
const folder = ref();
const img = ref();
const emits = defineEmits(["update-card"]);

function closeDialog() {
  emits("update-card", false);
}

async function addImg() {
  const response = await imgsStorage.insertImg(folder.value, img.value);
  notifyResponse(response);
  if (response.success) {
    closeDialog();
  }
}
</script>
