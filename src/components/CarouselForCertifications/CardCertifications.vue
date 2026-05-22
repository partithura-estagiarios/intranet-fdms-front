<template>
  <q-card :class="['row', 'my-card', 'no-wrap', isCiron ? 'layout-ciron' : '']">
    <q-card-section
      class="col-4 modern-sidebar q-pa-none column justify-between"
    >
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
            v-for="name in imgsStorage.certifications"
            :key="name"
            clickable
            class="sidebar-item"
            :class="
              selectedTab === name
                ? isCiron
                  ? 'bg-white text-orange-14'
                  : 'is-selected'
                : ''
            "
            @click="selectItem(name)"
          >
            <q-item-section avatar class="icon-section">
              <q-icon :name="getFolderIcon(name)" size="xs" />
            </q-item-section>

            <q-item-section
              class="text-uppercase text-center text-weight-bolder folder-title"
            >
              {{ formatTabLabel(name) }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div v-if="isLogged" class="column q-pa-md q-gutter-y-sm sidebar-footer">
        <q-btn
          unelevated
          :class="[
            'full-width',
            'btn-call-to-action',
            isCiron ? 'btn-call-to-action--ciron' : '',
          ]"
          @click="openAddDialog"
        >
          <q-icon name="add_circle_outline" size="sm" class="q-mr-sm" />
          <span class="text-weight-bold">{{ $t("action.addFolder") }}</span>
        </q-btn>

        <q-btn
          v-if="hasSelectedTab"
          unelevated
          dense
          class="full-width btn-delete-custom"
          @click="openDeleteDialog"
        >
          <q-icon name="highlight_off" size="xs" class="q-mr-xs" />
          <span class="text-weight-bold">{{ $t("action.deleteFolder") }}</span>
        </q-btn>
      </div>
    </q-card-section>

    <q-card-section class="col-8 flex flex-center" v-if="isImageValid">
      <q-img :src="getImageUrl(selectedTab)" />
    </q-card-section>

    <CardAddCertification
      :card="showAddModal"
      @update-card-folder="showAddModal = $event"
    />
    <CardExcludeCert
      :card="showDeleteModal"
      @update-card-folder="showDeleteModal = $event"
    />
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from "vue";
import { useImgs } from "../../stores/imgs";
import { useUsers } from "../../stores/user";
import LoadCertifications from "../../graphql/certification/LoadCertifications.gql";
import CardExcludeCert from "./CardExcludeCert.vue";

const imgsStorage = useImgs();
const userStorage = useUsers();
const selectedTab = ref<string>("");
const showAddModal = ref(false);
const showDeleteModal = ref(false);
const CUSTOM_REPLACE = /([a-zA-Z])([0-9])/g;
const ADD_HIFEN = "$1-$2";
const isLogged = computed(() => userStorage.getToken);
const hasSelectedTab = computed(() => !!selectedTab.value);
const isImageValid = computed(() =>
  imgsStorage.certifications.includes(selectedTab.value),
);

const layout = computed(() => getLayout());

const isCiron = computed(() => layout.value === "CIRON");
const FIRST_CERTIFICATION_INDEX = 0;
const EMPTY_IMAGE_NAME = "";
function openAddDialog() {
  showAddModal.value = true;
}
function openDeleteDialog() {
  showDeleteModal.value = true;
}
function selectItem(name: string) {
  selectedTab.value = name;
}
const getFolderIcon = (name: string) => {
  return selectedTab.value === name ? "folder_open" : "folder";
};
async function loadCertifications() {
  const { loadCertifications }: { loadCertifications: string[] } =
    await runQuery(LoadCertifications);
  imgsStorage.setFoldersCertifications(loadCertifications);
}

onMounted(async () => {
  await loadCertifications();
});

const getImageUrl = (imageName: string) => {
  return `${server_express_url}/serve-image-doc/${encodeURIComponent(imageName)}`;
};

const formatTabLabel = (name: string) => {
  const nameWithoutExtension = name.split(".")[0];
  const formattedName = nameWithoutExtension.replace(CUSTOM_REPLACE, ADD_HIFEN);
  return formattedName;
};

watchEffect(() => {
  if (!isImageValid.value) {
    selectedTab.value =
      imgsStorage.certifications.length > FIRST_CERTIFICATION_INDEX
        ? imgsStorage.certifications[FIRST_CERTIFICATION_INDEX]
        : EMPTY_IMAGE_NAME;
  }
  if (imgsStorage.reloadCertification) {
    loadCertifications();
    return imgsStorage.refreshCertificationsReload;
  }
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
}

.modern-sidebar {
  background-color: #1e3a5f;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-add-folder {
  background-color: #007bff !important;
  border-radius: 8px;
  height: 48px;
}
.sidebar-footer {
  background-color: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.btn-call-to-action {
  background-color: #007bff;
  color: white;
  border-radius: 6px;
  min-height: 48px;
  text-transform: none;
}
.btn-delete-custom {
  background-color: #f5f5f5;
  color: #c62828;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  text-transform: none;
  min-height: 32px;
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
.is-selected {
  background-color: #0056b3 !important;
  color: white !important;
}

.icon-section {
  min-width: 32px !important;
}

.text-center {
  text-align: center;
  margin-left: -32px;
}
</style>
