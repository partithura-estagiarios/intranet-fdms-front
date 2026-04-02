<template>
  <div>
    <q-input
      v-model="displayPath"
      :label="$t('files.createOn')"
      readonly
      autogrow
      filled
      class="q-mb-md bg-grey-2 text-body1"
    >
      <template v-slot:prepend>
        <q-icon name="folder" color="amber" />
      </template>
    </q-input>

    <q-file
      v-model="input"
      :label="$t('cardDocSig.attachments')"
      :hint="$t('files.overwriteHint')"
      accept=".pdf"
      outlined
      class="q-mb-md"
    >
      <template v-slot:prepend><q-icon name="attach_file" /></template>
    </q-file>

    <q-input
      outlined
      v-model="identifier"
      :label="$t('files.identifier')"
      class="q-mb-md"
    />

    <q-input outlined v-model="description" :label="$t('files.description')" />

    <q-card-actions align="right" class="q-mt-md q-pa-none">
      <q-btn
        color="blue-10"
        :label="$t('action.confirm')"
        @click="addFile()"
        :disable="isButtonDisabled"
        class="text-bold"
      />
    </q-card-actions>
  </div>
</template>

<script setup lang="ts">
import { useFiles } from "../../../stores/files";
const { notifyResponse } = useNotify();

const fileStorage = useFiles();
const props = defineProps({ path: { type: String, required: true } });
const emit = defineEmits(["close"]);

const identifier = ref("");
const description = ref("");
const input = ref<File | null>(null);

const displayPath = computed(() =>
  !props.path ? "Pasta Principal (Raiz)" : props.path.replace(/\//g, " / "),
);
const isButtonDisabled = computed(
  () => !input.value || (!identifier.value && !description.value),
);

async function addFile() {
  if (!input.value) return;

  const safeIdentifier = identifier.value.replace(/\./g, "");

  const response = await fileStorage.uploadFile(
    safeIdentifier,
    description.value,
    props.path,
    input.value,
  );
  notifyResponse(response);

  if (response.success) {
    emit("close");
  }
}
</script>
