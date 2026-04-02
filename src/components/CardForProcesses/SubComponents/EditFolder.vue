<template>
  <q-card-section class="text-black">
    <q-input
      v-model="folderName"
      :label="$t('files.folderName')"
      filled
      class="bg-grey-2 text-body1"
    >
      <template v-slot:prepend>
        <q-icon name="folder" color="amber" />
      </template>
    </q-input>
  </q-card-section>
  <q-card-actions align="right" class="q-pa-md q pt-none">
    <q-btn
      color="blue-10"
      class="text-bold"
      :disable="isButtonDisabled"
      @click="saveFolder()"
    >
      {{ $t("action.confirm") }}
    </q-btn>
  </q-card-actions>
</template>

<script setup>
import { useFiles } from "../../../stores/files";
const fileStorage = useFiles();
const { notifyResponse } = useNotify();

const emit = defineEmits(["close"]);
const props = defineProps({
  folder: {
    type: Object,
    required: true,
  },
});

const folderName = ref(props.folder.name);

async function saveFolder() {
  const response = await fileStorage.renameFolder(
    props.folder.path,
    folderName.value,
  );
  notifyResponse(response);

  if (response.success) {
    emit("close");
  }
}

const isButtonDisabled = computed(() => {
  return !folderName.value || folderName.value === props.folder.name;
});
</script>
