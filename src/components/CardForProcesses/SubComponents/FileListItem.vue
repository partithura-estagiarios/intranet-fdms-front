<template>
  <div
    class="q-my-sm rounded-borders"
    :class="[baseClasses, isActive ? activeClasses : '']"
  >
    <q-item
      clickable
      v-ripple
      @click="$emit('clickItem', item)"
      :class="itemPaddingClass"
    >
      <q-item-section avatar :class="avatarPaddingClass">
        <q-icon v-if="isRootFile" name="img:ico/icons8-pdf-80.png" size="md" />
        <q-icon
          v-else-if="isSubfolder"
          :name="subfolderIcon"
          color="amber"
          size="md"
        />
        <q-icon v-else name="folder" color="amber" size="md" />
      </q-item-section>

      <q-item-section :class="textStyleClass">
        {{ displayName }}
      </q-item-section>

      <ActionMenu
        :item="item"
        :iconColor="actionMenuIconColor"
        @edit="$emit('edit', item)"
        @delete="$emit('delete', item)"
      />
    </q-item>
  </div>
</template>

<script setup lang="ts">
import { formatFileName } from "../lib";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: "root",
  },
  canDive: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["clickItem", "edit", "delete"]);

const layout = computed(() => {
  const value =
    (import.meta.env["LAYOUT"] as string | undefined) ??
    (import.meta.env["VITE_LAYOUT"] as string | undefined) ??
    "FUNDIMISA";

  return value.trim().toUpperCase();
});

const isCiron = computed(() => layout.value === "CIRON");

const baseClasses = computed(() => {
  return props.variant === "subfolder"
    ? "bg-white text-black shadow-1 overflow-hidden"
    : "shadow-3";
});

const activeClasses = computed(() => {
  if (isCiron.value) {
    return props.variant === "subfolder"
      ? "bg-white text-bold text-orange-14"
      : "bg-white";
  }

  return props.variant === "subfolder"
    ? "bg-light-blue-1 text-bold text-primary"
    : "bg-light-blue-9";
});

const itemPaddingClass = computed(() => {
  return props.variant === "root" ? "q-px-sm" : "";
});

const avatarPaddingClass = computed(() => {
  return props.variant === "root" && props.item.type === "file"
    ? "q-pa-none"
    : "";
});

const textStyleClass = computed(() => {
  if (props.variant !== "root") return "";

  if (isCiron.value && props.isActive) {
    return "text-orange-14 text-bold";
  }

  return "text-white text-bold";
});

const isRootFile = computed(() => {
  return props.variant === "root" && props.item.type === "file";
});

const isSubfolder = computed(() => {
  return props.variant === "subfolder";
});

const subfolderIcon = computed(() => {
  return props.canDive ? "mdi-folder-move-outline" : "folder_open";
});

const actionMenuIconColor = computed(() => {
  if (props.variant !== "root") {
    return undefined;
  }

  if (isCiron.value && props.isActive) {
    return "orange-14";
  }

  return "white";
});

const displayName = computed(() => {
  if (props.variant === "root") {
    return props.item.identifier || formatFileName(props.item.name);
  }
  return props.item.name;
});
</script>
