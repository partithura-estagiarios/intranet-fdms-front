<template>
  <q-dialog
    :model-value="props.modelValue"
    @update:model-value="(val) => emits('update:modelValue', val)"
    @hide="onDialogHide"
  >
    <q-card class="icon-picker-card">
      <q-card-section class="items-center q-pb-none row">
        <div class="text-subtitle1 text-weight-medium">
          {{ textoTraduzido }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="flex flex-col gap-sm q-pt-sm">
        <q-input
          v-model="searchQuery"
          dense
          outlined
          rounded
          :placeholder="t('searchPlaceholder', locale)"
          clearable
          autofocus
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-tabs
          v-model="activeTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="all" :label="t('tabAll', locale)" />
          <q-tab name="material" label="Material" />
          <q-tab name="svg" label="SVG" />
        </q-tabs>

        <q-scroll-area class="icons-scroll-area">
          <div class="justify-start p-2 row q-col-gutter-sm">
            <div
              v-for="icon in filteredIcons"
              :key="icon.name"
              class="col-auto"
            >
              <div
                :class="[
                  'icon-grid-item cursor-pointer flex justify-center items-center',
                  props.selectedIcon === icon.name &&
                    (isCiron
                      ? 'icon-grid-item--active-ciron'
                      : 'icon-grid-item--active'),
                ]"
                @click="selectIcon(icon.name)"
              >
                <q-icon :name="icon.name" size="24px" />
                <q-tooltip>{{ icon.label }}</q-tooltip>
              </div>
            </div>
            <div
              v-if="filteredIcons.length === 0"
              class="text-grey-6 text-center col-12 q-pa-md"
            >
              {{ t("noIconsFound", locale) }}
            </div>
          </div>
        </q-scroll-area>

        <q-separator class="q-my-xs" />

        <div
          :class="[
            'svg-drop-zone flex flex-col items-center justify-center cursor-pointer gap-xs q-pa-md',
            isDragging && 'svg-drop-zone--dragging',
          ]"
          @click="triggerFileInput"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="onFileDrop"
        >
          <q-icon
            v-if="!uploadPreviewIcon"
            name="cloud_upload"
            size="28px"
            class="text-grey-5"
          />
          <div
            v-if="uploadPreviewIcon"
            class="flex justify-center items-center preview-box"
          >
            <q-icon :name="uploadPreviewIcon" size="28px" />
          </div>
          <span class="text-caption text-grey-6 text-center">
            {{
              uploadPreviewIcon
                ? t("uploadedLabel", locale)
                : t("dropZoneLabel", locale)
            }}
          </span>
          <input
            ref="fileInputRef"
            type="file"
            accept=".svg,image/svg+xml"
            class="hidden-input"
            @change="onFileInputChange"
          />
        </div>

        <q-expansion-item
          dense
          dense-toggle
          expand-separator
          icon="add"
          :label="t('addCustomTitle', locale)"
          class="custom-icon-expander"
        >
          <div class="flex flex-col gap-xs q-pa-sm">
            <q-input
              v-model="customIconName"
              dense
              outlined
              :label="t('customNameLabel', locale)"
              class="q-mb-xs"
            />
            <q-input
              v-model="customIconPath"
              dense
              outlined
              type="textarea"
              rows="2"
              :label="t('customPathLabel', locale)"
              :placeholder="t('customPathPlaceholder', locale)"
              class="q-mb-xs"
            />
            <q-btn
              dense
              color="primary"
              :label="t('btnAdd', locale)"
              @click="addCustomIcon"
              class="full-width"
              :disable="!customIconName || !customIconPath"
            />
          </div>
        </q-expansion-item>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { t, predefinedIcons } from "./lib";
import { getLayout, positiveNotify, negativeNotify } from "../../../helpers";

const { locale } = useI18n();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  selectedIcon: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["update:modelValue", "auto-close"]);

const fileInputRef = ref<HTMLInputElement | null>(null);
const uploadPreviewIcon = ref<string>("");
const isDragging = ref(false);

const LOCAL_STORAGE_KEY = "custom-user-svg-icons";
const customIcons = ref<Array<{ name: string; label: string; type: "custom" }>>(
  [],
);
const searchQuery = ref("");
const activeTab = ref("all");
const customIconName = ref("");
const customIconPath = ref("");

const textoTraduzido = computed(() => t("title", locale.value));
const isCiron = computed(() => getLayout() === "CIRON");

const allIcons = computed(() => [
  ...predefinedIcons,
  ...customIcons.value.map((i) => ({ ...i, type: "custom" as const })),
]);

const filteredIcons = computed(() => {
  let list = allIcons.value;
  if (activeTab.value !== "all") {
    list = list.filter((icon) => icon.type === activeTab.value);
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (icon) =>
        icon.label.toLowerCase().includes(q) ||
        icon.name.toLowerCase().includes(q),
    );
  }
  return list;
});

onMounted(() => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) customIcons.value = JSON.parse(saved);
  } catch (e) {
    console.error("Failed to load custom icons:", e);
  }

  if (
    props.selectedIcon &&
    !predefinedIcons.some((icon) => icon.name === props.selectedIcon)
  ) {
    const name = props.selectedIcon;
    const label = name.startsWith("img:")
      ? "Uploaded SVG"
      : name.startsWith("M")
        ? "Custom SVG Path"
        : name;

    if (name.startsWith("img:")) uploadPreviewIcon.value = name;

    if (!customIcons.value.some((icon) => icon.name === name)) {
      customIcons.value.push({ name, label, type: "custom" });
      saveCustomIcons();
    }
  }
});

const saveCustomIcons = () => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customIcons.value));
  } catch (e) {
    console.error("Failed to save custom icons:", e);
  }
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const processSvgFile = (file: File) => {
  if (file.type !== "image/svg+xml" && !file.name.endsWith(".svg")) {
    negativeNotify(t("uploadErrorOnlySvg", locale.value));
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) throw new Error("Empty file content");

      const iconName = "img:" + dataUrl;
      uploadPreviewIcon.value = iconName;

      const label = file.name.replace(/\.svg$/, "");
      const newItem = { name: iconName, label, type: "custom" as const };

      if (!customIcons.value.some((icon) => icon.name === newItem.name)) {
        customIcons.value.push(newItem);
        saveCustomIcons();
      }

      selectIcon(newItem.name);
      positiveNotify(t("uploadSuccess", locale.value));
    } catch {
      negativeNotify(t("uploadError", locale.value));
    }
  };
  reader.onerror = () => negativeNotify(t("uploadError", locale.value));
  reader.readAsDataURL(file);
};

const onFileInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) processSvgFile(file);
  input.value = "";
};

const onFileDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) processSvgFile(file);
};

const addCustomIcon = () => {
  if (!customIconName.value || !customIconPath.value) return;

  const path = customIconPath.value.trim();
  const newItem = {
    name: path,
    label: customIconName.value.trim(),
    type: "custom" as const,
  };

  if (!customIcons.value.some((icon) => icon.name === newItem.name)) {
    customIcons.value.push(newItem);
    saveCustomIcons();
  }

  customIconName.value = "";
  customIconPath.value = "";
  selectIcon(newItem.name);
};

const selectIcon = (name: string) => {
  emits("auto-close", name);
  emits("update:modelValue", false);
};

const onDialogHide = () => {
  searchQuery.value = "";
};
</script>

<style scoped>
.icon-picker-card {
  width: 600px;
  max-width: 95vw;
  border-radius: 12px;
}

.icons-scroll-area {
  height: 220px;
}

.icon-grid-item {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(0, 0, 0, 0.02);
  color: rgb(70, 80, 95);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  padding: 4px;
}

.icon-grid-item:hover {
  transform: translateY(-2px) scale(1.08);
  background: rgba(31, 73, 125, 0.06);
  border-color: rgba(31, 73, 125, 0.2);
  color: rgb(31, 73, 125);
  box-shadow: 0 4px 8px rgba(31, 73, 125, 0.1);
}

.icon-grid-item :deep(.q-icon) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-grid-item :deep(img) {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.icon-grid-item--active {
  background: rgba(31, 73, 125, 0.08) !important;
  border-color: rgb(31, 73, 125) !important;
  color: rgb(31, 73, 125) !important;
  box-shadow: 0 0 0 2px rgba(31, 73, 125, 0.15);
  transform: scale(1.04);
}

.icon-grid-item--active-ciron {
  background: rgba(255, 87, 0, 0.08) !important;
  border-color: #ff5700 !important;
  color: #ff5700 !important;
  box-shadow: 0 0 0 2px rgba(255, 87, 0, 0.15);
  transform: scale(1.04);
}

.svg-drop-zone {
  border: 2px dashed rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.01);
  min-height: 80px;
  transition: all 0.2s ease;
  position: relative;
}

.svg-drop-zone:hover {
  border-color: rgba(31, 73, 125, 0.35);
  background: rgba(31, 73, 125, 0.03);
}

.svg-drop-zone--dragging {
  border-color: rgb(31, 73, 125) !important;
  background: rgba(31, 73, 125, 0.06) !important;
}

.hidden-input {
  display: none;
}

.preview-box {
  border: 1px dashed rgba(0, 0, 0, 0.12);
  background: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
  width: 40px;
  height: 40px;
  overflow: hidden;
}

.preview-box :deep(.q-icon) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-box :deep(img) {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.custom-icon-expander {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.01);
}
</style>
