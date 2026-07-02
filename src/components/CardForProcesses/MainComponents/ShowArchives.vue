<template>
  <q-card-section
    class="bg-grey-2 col-12 col-sm column q-pa-none archives-section"
  >
    <FileActionBtns @add="openModal('add')" />

    <div
      class="flex items-center bg-grey-2 border-b text-body2 text-grey-8 q-pa-sm"
    >
      <q-icon name="folder_open" class="q-mr-sm" size="xs" />
      <span class="text-bold">{{ currentPath }}</span>
    </div>

    <div
      v-if="showEmptyState"
      class="flex flex-center q-mt-xl text-grey-6 col column"
    >
      <q-icon name="folder_open" size="4rem" />
      <div class="q-mt-sm text-h6">{{ $t("files.emptyFolderText") }}</div>
      <div class="text-body2">{{ $t("files.emptyFolderSubText") }}</div>
    </div>

    <div class="col q-pa-md scroll" v-else>
      <div class="row q-col-gutter-md">
        <div
          class="col-6 col-sm-4 col-md-3"
          v-for="pdf in pdfFiles"
          :key="pdf.path"
        >
          <PdfCard
            :pdf="pdf"
            @open="openPdf"
            @edit="openModal('edit', $event)"
            @delete="openModal('delete', $event)"
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

function openModal(action: ModalAction, item: FileSystemItem | null = null) {
  selectedItem.value = item;
  activeModal.value = action;
}

function closeModal() {
  activeModal.value = null;
  selectedItem.value = null;
}

const pdfFiles = computed(() => {
  if (fileStorage.currentPath === "") {
    return [];
  }
  return fileStorage.currentDirectoryContents.filter(
    (item) => item.type === "file",
  );
});

function openPdf(pdf: FileSystemItem) {
  fileStorage.displayPdf(pdf.path);
}

const path = computed(() => fileStorage.currentPath);
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(44, 44, 44, 0.2);
}
.dialog-size {
  width: 50vw;
}

@media (max-width: 1023px) {
  .dialog-size {
    width: 90vw;
  }
}

@media (max-width: 599px) {
  .archives-section {
    height: 50vh;
  }
}
</style>
