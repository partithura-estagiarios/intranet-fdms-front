<template>
  <q-card-section
    v-if="hasRootFolderSelected"
    class="bg-grey-1 col-12 col-sm-3 column q-pa-none container"
  >
    <div class="q-pa-sm col scroll">
      <q-item
        v-if="canGoBack"
        class="bg-grey-3 q-my-sm rounded-borders text-black"
        clickable
        v-ripple
        @click="goBack"
      >
        <q-item-section avatar>
          <q-icon name="arrow_back" />
        </q-item-section>
        <q-item-section>{{ $t("action.back") }}</q-item-section>
      </q-item>

      <FileListItem
        v-for="item in displayedFolders"
        :key="item.path"
        :item="item"
        variant="subfolder"
        :isActive="fileStorage.currentPath === item.path"
        :canDive="canDive(item)"
        @clickItem="handleItemClick"
        @edit="openModal('edit', $event)"
        @delete="openModal('delete', $event)"
      />

      <div v-if="showEmptyState" class="q-mt-md text-grey text-center">
        {{ $t("files.emptySubFolder") }}
      </div>
    </div>

    <AddItemBtn
      v-if="useUser.getToken"
      variant="subfolder"
      @click="openModal('add')"
    />
  </q-card-section>

  <q-dialog :model-value="!!activeModal" @update:model-value="closeModal">
    <q-card class="dialog-size">
      <DialogHeader @close="closeModal" :option="modalTitle" />

      <AddItemModal
        v-if="activeModal === 'add'"
        allow-folder
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
import { useUsers } from "../../../stores/user";

const useUser = useUsers();
const fileStorage = useFiles();

const hasRootFolderSelected = computed(() => rootPath.value !== "");
const canGoBack = computed(() => viewPath.value !== rootPath.value);
const showEmptyState = computed(() => displayedFolders.value.length === 0);

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

const rootPath = computed(() => fileStorage.currentPath.split("/")[0]);

const viewPath = ref("");

watch(
  rootPath,
  (newRoot) => {
    if (newRoot) {
      viewPath.value = newRoot;
    }
  },
  { immediate: true },
);

function canDive(folder: FileSystemItem): boolean {
  if (folder.type === "file") return false;
  return folder.children && folder.children.some((c) => c.type === "folder");
}

const displayedFolders = computed(() => {
  const findNode = (
    nodes: FileSystemItem[],
    targetPath: string,
  ): FileSystemItem | undefined => {
    for (const node of nodes) {
      if (node.path === targetPath) return node;
      if (node.children) {
        const found = findNode(node.children, targetPath);
        if (found) return found;
      }
    }
    return undefined;
  };

  const currentNode = findNode(fileStorage.folders, viewPath.value);
  return currentNode && currentNode.children
    ? currentNode.children.filter((item) => item.type === "folder")
    : [];
});

function handleItemClick(item: FileSystemItem) {
  if (canDive(item)) {
    viewPath.value = item.path;
    fileStorage.navigateTo(item.path);
    return;
  }
  fileStorage.navigateTo(item.path);
}

function goBack() {
  if (viewPath.value.includes("/")) {
    viewPath.value = viewPath.value.substring(
      0,
      viewPath.value.lastIndexOf("/"),
    );
    fileStorage.navigateTo(viewPath.value);
  }
}
</script>

<style scoped>
.container {
  border-right: 1px solid #e0e0e0 !important;
}

@media (max-width: 599px) {
  .container {
    height: 40vh;
    border-right: none !important;
    border-bottom: 1px solid #e0e0e0 !important;
  }
}
.add-button-container {
  border-top: 1px solid rgba(44, 44, 44, 0.2);
}
.dialog-size {
  width: 50vw;
}

@media (max-width: 1023px) {
  .dialog-size {
    width: 90vw;
  }
}
</style>
