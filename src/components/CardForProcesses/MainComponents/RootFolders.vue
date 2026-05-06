<template>
  <q-card-section class="col-2 column q-pa-none container">
    <div class="col scroll q-pa-sm custom-scroll">
      <FileListItem
        v-for="item in fileStorage.folders"
        :key="item.path"
        :item="item"
        variant="root"
        :isActive="isItemActive(item.path)"
        @clickItem="handleItemClick"
        @edit="openModal('edit', $event)"
        @delete="openModal('delete', $event)"
      />
    </div>

    <AddItemBtn
      v-if="useUser.getToken"
      variant="root"
      @click="openModal('add')"
    />
  </q-card-section>

  <q-dialog :model-value="!!activeModal" @update:model-value="closeModal">
    <q-card class="dialog-size">
      <DialogHeader @close="closeModal" :option="modalTitle" />

      <AddItemModal
        v-if="activeModal === 'add'"
        allow-folder
        allow-file
        path=""
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
import { useUsers } from "../../../stores/user";

const useUser = useUsers();

const fileStorage = useFiles();

type ModalAction = "add" | "edit" | "delete" | null;

const activeModal = ref<ModalAction>(null);
const selectedItem = ref<FileSystemItem | null>(null);

const modalTitle = computed(() => {
  const titles = {
    add: "files.newItem",
    edit: "files.editItem",
    delete: "files.deleteItem",
  };
  return activeModal.value ? titles[activeModal.value] : "";
});

function openModal(action: ModalAction, item: FileSystemItem | null = null) {
  selectedItem.value = item;
  activeModal.value = action;
}

function closeModal() {
  activeModal.value = null;
  selectedItem.value = null;
}

function handleItemClick(item: FileSystemItem) {
  if (item.type === "file") {
    fileStorage.displayPdf(item.path);
    return;
  }
  fileStorage.navigateTo(item.path);
}

function isItemActive(path: string) {
  return (
    fileStorage.currentPath === path ||
    fileStorage.currentPath.startsWith(path + "/")
  );
}
</script>

<style scoped>
.container {
  background-color: rgb(31, 73, 125);
}

.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.add-button-container {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.dialog-size {
  width: 50vw;
  min-width: 400px;
}
</style>
