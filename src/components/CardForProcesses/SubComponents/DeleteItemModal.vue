<template>
  <div>
    <q-card-section class="column items-center q-pb-none">
      <div class="text-grey-10 text-center text-body1 text-bold q-py-md">
        {{ text }}
      </div>

      <q-card class="item-visualization column items-center q-pa-md" flat>
        <q-icon :name="icon" color="amber" size="4rem" />
        <div class="text-bold text-h6 q-mt-sm text-center">
          {{ item.identifier }}
        </div>
        <div class="text-bold text-caption text-wrap text-center">
          {{ item.description || item.name }}
        </div>
      </q-card>

      div
    </q-card-section>
    <q-card-actions align="right" class="q-pa-md">
      <q-btn
        :label="$t('action.confirm')"
        color="blue-10"
        class="text-bold"
        @click="deleteItem()"
      />
    </q-card-actions>
  </div>
</template>

<script setup lang="ts">
import { useFiles } from "../../../stores/files";
const { t } = useI18n();
const { notifyResponse } = useNotify();
const fileStorage = useFiles();

const emit = defineEmits(["close"]);
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
});

const text = computed(() => {
  if (props.item.type === "folder") {
    return t("files.deleteFolderText", { name: props.item.name });
  }
  return t("files.deleteFileText", { name: props.item.name });
});

const icon = computed(() => {
  if (props.item.type === "folder") {
    return "folder";
  }
  return "img:ico/icons8-pdf-80.png";
});

async function deleteItem() {
  const response = await fileStorage.excludeItem(props.item.path);
  notifyResponse(response);

  if (response.success) {
    emit("close");
  }
}
</script>

<style>
.item-visualization {
  max-width: 250px !important;
  color: #3d45b9 !important;
}
</style>
