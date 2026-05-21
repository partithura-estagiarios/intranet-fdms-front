<template>
  <q-card
    :class="['my-card', 'shadow-2', 'bg-white', isCiron ? 'layout-ciron' : '']"
  >
    <div class="row items-stretch full-height">
      <div class="col-3 modern-sidebar column justify-between">
        <div>
          <div class="row items-center q-pa-md sidebar-header">
            <q-icon
              name="folder_shared"
              color="white"
              size="sm"
              class="q-mr-sm"
            />
            <span
              class="text-subtitle2 text-white text-weight-bolder text-uppercase"
            >
              {{ $t("tab.folders") }}
            </span>
          </div>

          <q-list class="q-py-sm scroll-sidebar">
            <q-item
              v-for="name in namesOfImgs"
              :key="name"
              clickable
              class="sidebar-item"
              :class="
                titleImg === name
                  ? isCiron
                    ? 'bg-white text-orange-14'
                    : 'is-selected'
                  : ''
              "
              @click="selectFolder(name)"
            >
              <q-item-section avatar min-width="32px">
                <q-icon
                  :name="titleImg === name ? 'folder_open' : 'folder'"
                  size="xs"
                />
              </q-item-section>
              <q-item-section
                class="text-uppercase text-center text-weight-bolder folder-title"
              >
                {{ name }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div
          v-if="isLogged"
          class="column q-pa-sm q-gutter-y-sm sidebar-footer"
        >
          <q-btn
            unelevated
            :class="[
              'full-width',
              'btn-call-to-action',
              isCiron ? 'btn-call-to-action--ciron' : '',
            ]"
            @click="openAddFolderDialog"
          >
            <div
              class="row items-center justify-center full-width q-gutter-x-sm"
            >
              <q-icon name="add_circle_outline" size="sm" />
              <span class="text-weight-bold">{{ $t("action.addFolder") }}</span>
            </div>
          </q-btn>

          <q-btn
            v-if="titleImg"
            unelevated
            dense
            class="full-width btn-delete-custom"
            @click="openDeleteFolderDialog"
          >
            <div class="row items-center justify-center q-gutter-x-xs">
              <q-icon name="highlight_off" size="xs" />
              <span class="text-weight-bold">{{
                $t("action.deleteFolder")
              }}</span>
            </div>
          </q-btn>
        </div>
      </div>

      <div class="col-9 flex-content bg-white column items-center">
        <div
          class="row full-width justify-end q-pa-sm bg-grey-1 border-bottom q-gutter-x-sm"
          v-if="isLogged && titleImg"
        >
          <q-btn unelevated dense class="btn-add-image" @click="triggerUpload">
            <div class="row items-center justify-center q-gutter-x-xs">
              <q-icon name="add_circle_outline" size="xs" />
              <span class="text-weight-medium">{{
                $t("action.addImage")
              }}</span>
            </div>
          </q-btn>

          <q-btn
            unelevated
            dense
            class="btn-delete-item-custom"
            @click="openDeleteImgDialog"
          >
            <div class="row items-center justify-center q-gutter-x-xs">
              <q-icon name="highlight_off" size="xs" />
              <span class="text-weight-medium">{{
                $t("action.deleteFile")
              }}</span>
            </div>
          </q-btn>
        </div>

        <div
          v-if="allFolders && allFolders.length > 0 && titleImg"
          class="content-area full-width flex-grow"
        >
          <ImgsInstitutional
            ref="imgsRef"
            :folders="allFolders"
            :name="computedTitleImg"
            @update-imgs="loadAllDocsInt"
          />
        </div>

        <div
          v-else
          class="text-grey-5 column items-center q-pa-xl empty-state flex-grow justify-center"
        >
          <q-icon name="collections" size="xl" />
          <span class="text-weight-bolder text-uppercase q-mt-md">{{
            $t("action.selectTheFolder")
          }}</span>
        </div>
      </div>
    </div>

    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card class="dialog-delete-card bg-white text-black">
        <q-card-section class="row items-center">
          <q-icon name="warning" color="negative" size="md" />
          <span class="q-ml-sm text-weight-bold">
            {{ $t("action.deleteSureFile") }}
          </span>
        </q-card-section>
        <q-card-section class="q-pt-none"
          >{{ $t("action.deleteSureFolder", { pasta: titleImg }) }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            :label="$t('action.deleteButton')"
            color="negative"
            @click="executeDeletion"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeleteImgDialog" persistent>
      <q-card class="dialog-delete-card bg-white text-black">
        <q-card-section class="row items-center">
          <q-icon name="warning" color="negative" size="md" />
          <span class="q-ml-sm text-weight-bold">{{
            $t("action.deleteSureFile")
          }}</span>
        </q-card-section>
        <q-card-section class="q-pt-none">{{
          $t("action.deleteSureImg")
        }}</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            :label="$t('action.deleteButton')"
            color="negative"
            @click="executeImgDeletion"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <CardAddFolderInst
      :card="cardAddFolder"
      @update-card-folder="updateCardFolder"
      @folder-created="loadAllDocsInt"
    />
    <input
      ref="uploadInput"
      type="file"
      accept="image/*"
      class="hidden-input"
      @change="uploadImg"
    />
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import GetAllImgs from "../../graphql/institutionalImgs/GetAllImgs.gql";
import { FoldersIntitutional } from "../../entities/imgsInstitutional";
import { createPath } from "./lib";
import { useImgs } from "../../stores/imgs";
import { useUsers } from "../../stores/user";
//import CardAddFolderInst from "./OptsCardSig/CardAddFolderInst/CardAddFolderInst.vue";

const imgsStorage = useImgs();
const userStorage = useUsers();
const { notifyResponse } = useNotify();
const showDeleteImgDialog = ref(false);
const namesOfImgs = ref<string[]>([]);
const allFolders = ref<any[]>([]);
const titleImg = ref("");
const cardAddFolder = ref(false);
const showDeleteDialog = ref(false);
const uploadInput = ref<HTMLInputElement | null>(null);
const imgsRef = ref<any>(null);
const computedTitleImg = computed(() => titleImg.value);
const isLogged = computed(() => userStorage.getToken);

const layout = computed(() => {
  const value =
    (import.meta.env["LAYOUT"] as string | undefined) ??
    (import.meta.env["VITE_LAYOUT"] as string | undefined) ??
    "FUNDIMISA";

  return value.trim().toUpperCase();
});

const isCiron = computed(() => layout.value === "CIRON");

function openDeleteImgDialog() {
  showDeleteImgDialog.value = true;
}

function openDeleteFolderDialog() {
  showDeleteDialog.value = true;
}

function selectFolder(name: string) {
  titleImg.value = name;
}

function updateCardFolder(value: boolean) {
  cardAddFolder.value = value;
}

async function loadAllDocsInt() {
  try {
    const response = (await runQuery(GetAllImgs)) as {
      getAllImgs?: FoldersIntitutional[];
    };
    const getAllImgs: FoldersIntitutional[] = response?.getAllImgs ?? [];
    allFolders.value = createPath(getAllImgs);
    namesOfImgs.value = getAllImgs.map((folder) => folder.name);
    if (namesOfImgs.value.length > 0 && !titleImg.value) {
      titleImg.value = namesOfImgs.value[0];
    }
  } catch (error) {
    console.error(error);
  }
}

async function executeDeletion() {
  if (!titleImg.value) {
    return;
  }
  const result = await imgsStorage.deleteFolderInstitutional(titleImg.value);
  notifyResponse(result);
  if (result.success) {
    showDeleteDialog.value = false;
    titleImg.value = "";
    await loadAllDocsInt();
  }
}

async function executeImgDeletion() {
  if (imgsRef.value && typeof imgsRef.value.deleteImg === "function") {
    const result = await imgsRef.value.deleteImg();
    notifyResponse(result);
    if (result.success) {
      showDeleteImgDialog.value = false;
    }
  }
}

function openAddFolderDialog() {
  cardAddFolder.value = true;
}
function triggerUpload() {
  uploadInput.value?.click();
}

async function uploadImg(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file || !titleImg.value) {
    return;
  }
  const result = await imgsStorage.insertImg(titleImg.value, file);
  notifyResponse(result);
  if (result.success) {
    await loadAllDocsInt();
  }
}

onMounted(() => {
  loadAllDocsInt();
});
</script>
<style scoped>
.my-card {
  width: 90rem;
  max-width: 95vw;
  height: 55rem;
  margin-top: -7rem;
  border-radius: 8px;
  overflow: hidden;
}

.layout-ciron .modern-sidebar {
  background-color: var(--q-dark) !important;
}

.layout-ciron .btn-call-to-action--ciron {
  background-color: var(--q-warning) !important;
  color: var(--q-dark) !important;
}

.modern-sidebar {
  background-color: #1e3a5f;
  color: white;
  border-right: 1px solid #dcdcdc;
}

.sidebar-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-item {
  margin: 6px 10px;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  min-height: 50px;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}

.folder-title {
  font-weight: 900 !important;
  letter-spacing: 0.5px;
}

.sidebar-item.is-selected {
  background-color: #0056b3 !important;
  color: white !important;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.4);
}

.sidebar-item.is-selected .q-icon {
  color: white !important;
}

.text-center {
  text-align: center;
}

.sidebar-footer {
  background-color: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-call-to-action {
  background-color: #007bff;
  color: white;
  border-radius: 6px;
  padding: 10px 16px;
  min-height: 48px;
  text-transform: none;
}

.btn-add-image {
  background-color: #f5f5f5;
  color: #757575;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  padding: 4px 10px;
  text-transform: none;
  min-height: 32px;
}

.btn-delete-item-custom {
  background-color: #f5f5f5;
  color: #c62828;
  border: 1px solid #c62828;
  border-radius: 4px;
  padding: 4px 10px;
  text-transform: none;
  min-height: 32px;
}

.btn-delete-custom {
  background-color: #f5f5f5;
  color: #c62828;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  padding: 4px 10px;
  text-transform: none;
  min-height: 32px;
}

.btn-add-image .q-icon,
.btn-delete-item-custom .q-icon,
.btn-delete-custom .q-icon {
  margin-right: -2px;
}

.scroll-sidebar {
  flex: 1;
  overflow-y: auto;
}

.flex-grow {
  flex: 1;
}
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
.hidden-input {
  display: none;
}
.dialog-delete-card {
  min-width: 300px;
}
.dialog-delete-card {
  min-width: 300px;
}
</style>
