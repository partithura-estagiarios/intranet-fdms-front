<template>
  <q-card-section class="q-pt-none">
    <q-tabs
      v-if="allowFolder && allowFile"
      v-model="tab"
      dense
      class="text-grey-7 q-mb-sm"
      active-color="blue-10"
      indicator-color="blue-10"
      align="justify"
      narrow-indicator
    >
      <q-tab
        name="folder"
        icon="folder"
        :label="$t('files.newFolder')"
        class="text-lowercase"
      />
      <q-tab
        name="file"
        icon="picture_as_pdf"
        :label="$t('files.newFile')"
        class="text-lowercase"
      />
    </q-tabs>

    <q-separator v-if="allowFolder && allowFile" />

    <q-tab-panels v-model="tab" animated class="q-mt-md">
      <q-tab-panel name="folder" class="q-pa-none" v-if="allowFolder">
        <AddFolder :path="path" @close="$emit('close')" />
      </q-tab-panel>

      <q-tab-panel name="file" class="q-pa-none" v-if="allowFile">
        <AddFile :path="path" @close="$emit('close')" />
      </q-tab-panel>
    </q-tab-panels>
  </q-card-section>
</template>

<script setup lang="ts">
const props = defineProps({
  allowFolder: {
    type: Boolean,
    default: false,
  },
  allowFile: {
    type: Boolean,
    default: false,
  },
  path: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["close"]);

const tab = ref(props.allowFolder ? "folder" : "file");

watch(
  () => props.allowFolder,
  (newVal) => {
    if (newVal) tab.value = "folder";
    else tab.value = "file";
  },
);
</script>
