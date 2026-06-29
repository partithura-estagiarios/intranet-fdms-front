<template>
  <q-card-section class="column q-gutter-y-md">
    <q-file
      outlined
      v-model="newFile"
      accept=".pdf"
      :label="$t('files.newAttachment')"
    >
      <template v-slot:prepend
        ><q-icon name="attach_file" color="black"
      /></template>
    </q-file>

    <q-input
      outlined
      v-model="identifier"
      :label="$t('files.identifier')"
      hide-bottom-space
    />

    <q-input
      outlined
      v-model="description"
      :label="$t('files.description')"
      autogrow
      hide-bottom-space
    />
  </q-card-section>

  <q-card-actions align="right" class="q-px-md q-pb-md q-pt-none">
    <q-btn
      type="submit"
      color="blue-10"
      class="text-bold"
      :disable="isButtonDisabled"
      @click="saveFile()"
    >
      {{ $t("action.confirm") }}
    </q-btn>
  </q-card-actions>
</template>

<script setup lang="ts">
import { useFiles } from "../../../stores/files";
const fileStorage = useFiles();
const { notifyResponse } = useNotify();

const emit = defineEmits(["close"]);
const props = defineProps({
  file: {
    type: Object,
    required: true,
  },
});

const currentArchiveName = ref<string>(props.file.name);
const newFile = ref<File | null>(null);
const identifier = ref<string>(props.file.identifier);
const description = ref<string>(props.file.description);

const isButtonDisabled = computed(
  () => !identifier.value && !description.value,
);

async function saveFile() {
  const response = newFile.value
    ? await fileStorage.uploadFile(
        identifier.value,
        description.value,
        props.file.path.slice(0, props.file.path.lastIndexOf("/")),
        newFile.value,
        currentArchiveName.value,
      )
    : await fileStorage.editFile(
        props.file.path,
        identifier.value,
        description.value,
      );

  notifyResponse(response);

  if (response.success) {
    emit("close");
  }
}
</script>
