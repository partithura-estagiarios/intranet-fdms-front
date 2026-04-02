<template>
  <q-card-section class="col column bg-grey-2 q-pa-none">
    <FileActionBtns
      :hasSelectedItem="!!selectedItem"
      @open="openPdf()"
      @edit="openModal('edit')"
      @delete="openModal('delete')"
      @add="openModal('add')"
    />

    <div
      class="q-pa-sm bg-grey-2 text-grey-8 text-body2 flex items-center border-b"
    >
      <q-icon name="folder_open" class="q-mr-sm" size="xs" />
      <span class="text-bold">{{ currentPath }}</span>
    </div>

    <div
      v-if="showEmptyState"
      class="flex col flex-center text-grey-6 column q-mt-xl"
    >
      <q-icon name="folder_open" size="4rem" />
      <div class="text-h6 q-mt-sm">{{ $t("files.emptyFolderText") }}</div>
      <div class="text-body2">{{ $t("files.emptyFolderSubText") }}</div>
    </div>

    <div class="col q-pa-md scroll" v-else>
      <div class="row q-col-gutter-md">
        <div class="col-3" v-for="pdf in pdfFiles" :key="pdf.path">
          <PdfCard
            :pdf="pdf"
            :isSelected="selectedItem === pdf"
            @select="selectItem"
            @open="openPdf"
          />
        </div>
      </div>
    </div>
  </q-card-section>

  <q-dialog :model-value="!!activeModal" @update:model-value="closeModal">
    <q-card class="dialog-size">
      <DialogHeader @close="closeModal" :option="modalTitle" />

      <AddItemModal
        v-if="activeModal === 'add'"
        allow-folder
        allow-file
        :path="fileStorage.currentPath"
        @close="closeModal"
      />

      <EditItemModal
        v-else-if="activeModal === 'edit' && selectedItem"
        :item="selectedItem"
        @close="closeModal"
      />

      <DeleteItemModal
        v-else-if="activeModal === 'delete' && selectedItem"
        :item="selectedItem"
        @close="closeModal"
      />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useFiles } from "../../../stores/files";
import { FileSystemItem } from "../../../entities/files";

const fileStorage = useFiles();

const showEmptyState = computed(() => pdfFiles.value.length === 0);
const currentPath = computed(() => {
  if (path.value) {
    return path.value.replace(/\//g, " > ");
  }
  return "Raíz";
});

type ModalAction = "add" | "edit" | "delete" | null;

const activeModal = ref<ModalAction>(null);
const selectedItem = ref<FileSystemItem | null>(null);

const modalTitle = computed(() => {
  const titles = {
    add: "files.newItem",
    edit: "files.editItem",
    delete: "files.deleteItem",
  };
  if (activeModal.value) {
    return titles[activeModal.value];
  }
  return "";
});

function openModal(action: ModalAction) {
  activeModal.value = action;
}

function closeModal() {
  activeModal.value = null;
}

const pdfFiles = computed(() => {
  if (fileStorage.currentPath === "") {
    return [];
  }
  return fileStorage.currentDirectoryContents.filter(
    (item) => item.type === "file",
  );
});

function selectItem(pdf: FileSystemItem) {
  if (selectedItem.value === pdf) {
    selectedItem.value = null;
    return;
  }
  selectedItem.value = pdf;
}

function openPdf() {
  if (selectedItem.value) {
    fileStorage.displayPdf(selectedItem.value.path);
  }
}
const path = computed(() => fileStorage.currentPath);

watch(path, (newPatch) => {
  if (newPatch) {
    selectedItem.value = null;
  }
});
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(44, 44, 44, 0.2);
}
.dialog-size {
  width: 50vw;
}
</style>
