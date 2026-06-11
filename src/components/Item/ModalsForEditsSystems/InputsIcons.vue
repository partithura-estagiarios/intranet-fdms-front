<template>
  <q-input
    v-model="mod"
    stack-label
    :label="$t('text.icon')"
    class="q-px-md"
    placeholder="e.g. home, M12..."
    @update:model-value="(val) => emits('receveid', val)"
  >
    <template #prepend v-if="mod">
      <div class="flex justify-center items-center preview-box">
        <q-icon :name="mod" size="20px" />
      </div>
    </template>

    <template #append>
      <q-icon
        name="add"
        class="cursor-pointer color-custom hover-scale"
        @click="enableList = !enableList"
      >
        <q-tooltip>{{ $t("action.selectIcon") || "Select Icon" }}</q-tooltip>
      </q-icon>

      <ListIcons
        @auto-close="handleIcon"
        v-model="enableList"
        :selected-icon="mod"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { ref } from "vue";

const mod = ref("add");
const emits = defineEmits(["receveid"]);
const enableList = ref(false);

const handleIcon = (option: string) => {
  mod.value = option;
  emits("receveid", option);
};
</script>

<style scoped>
.color-custom {
  color: rgb(31, 73, 125);
}
.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.2);
}
.preview-box {
  border: 1px dashed rgba(0, 0, 0, 0.15);
  background: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  width: 32px;
  height: 32px;
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
</style>
