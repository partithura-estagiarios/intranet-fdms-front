<template>
  <div class="q-px-sm" :class="borderContainerClass">
    <q-item
      class="shadow-3 q-my-sm rounded-borders"
      :class="itemBackgroundClass"
      clickable
      v-ripple
      @click="$emit('click')"
    >
      <q-item-section avatar>
        <q-icon name="add_circle_outline" :color="iconColor" size="md" />
      </q-item-section>

      <q-item-section class="ellipsis" :class="textClass">
        {{ $t("files.newItem") }}
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  variant: {
    type: String,
    default: "root",
  },
});

defineEmits(["click"]);

const layout = computed(() => getLayout());

const isCiron = computed(() => layout.value === "CIRON");

const borderContainerClass = computed(() => {
  return props.variant === "root" ? "border-root" : "border-subfolder";
});

const itemBackgroundClass = computed(() => {
  if (props.variant === "root") {
    return isCiron.value ? "bg-white" : "bg-light-blue-9";
  }
  return "bg-grey-3";
});

const iconColor = computed(() => {
  if (props.variant !== "root") {
    return "grey-8";
  }
  return isCiron.value ? "orange-14" : "white";
});

const textClass = computed(() => {
  if (props.variant !== "root") {
    return "text-grey-8 text-bold";
  }

  return isCiron.value ? "text-orange-14 text-bold" : "text-white text-bold";
});
</script>

<style scoped>
.border-root {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.border-subfolder {
  border-top: 1px solid rgba(44, 44, 44, 0.2);
}
</style>
