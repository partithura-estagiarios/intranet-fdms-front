<template>
  <div>
    <q-input
      v-model="displayPath"
      :label="$t('files.createOn')"
      autogrow
      readonly
      filled
      class="q-mb-md bg-grey-2 text-body1"
    >
      <template v-slot:prepend>
        <q-icon name="folder" color="amber" />
      </template>
    </q-input>

    <q-input
      v-model="folderName"
      outlined
      :label="$t('files.folderName')"
      class="q-mb-md"
      autofocus
    />

    <q-card-actions align="right" class="q-mt-md q-pa-none">
      <q-btn
        color="blue-10"
        :label="$t('action.confirm')"
        @click="addFolder()"
        :disable="!folderName"
        class="text-bold"
      />
    </q-card-actions>
  </div>
</template>

<script setup lang="ts">
import { useFiles } from "../../../stores/files";
const { notifyResponse } = useNotify();
const fileStorage = useFiles();

const emit = defineEmits(["close"]);
const props = defineProps({
  path: {
    type: String,
    required: true,
  },
});

const folderName = ref("");

const displayPath = computed(() => {
  if (!props.path || props.path === "") {
    return "Pasta Principal (Raiz)";
  }
  return props.path.replace(/\//g, " / ");
});

async function addFolder() {
  const response = await fileStorage.insertFolder(props.path, folderName.value);
  notifyResponse(response);

  if (response.success) {
    emit("close");
  }
}
</script>

<style scoped>
.font-custom {
  font-family: Fira Sans;
  height: 3rem;
}
</style>
