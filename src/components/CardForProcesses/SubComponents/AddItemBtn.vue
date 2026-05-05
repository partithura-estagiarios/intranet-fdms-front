<template>
  <div class="col-auto q-px-sm" :class="borderContainerClass">
    <q-item
      class="q-my-sm rounded-borders shadow-3"
      :class="itemBackgroundClass"
      clickable
      v-ripple
      @click="$emit('click')"
    >
      <q-item-section avatar>
        <q-icon name="add_circle_outline" :color="iconColor" size="md" />
      </q-item-section>

      <q-item-section :class="textClass">
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

const borderContainerClass = computed(() => {
  return props.variant === "root" ? "border-root" : "border-subfolder";
});

const itemBackgroundClass = computed(() => {
  return props.variant === "root" ? "bg-light-blue-9" : "bg-grey-3";
});

const iconColor = computed(() => {
  return props.variant === "root" ? "white" : "grey-8";
});

const textClass = computed(() => {
  return props.variant === "root"
    ? "text-white text-bold"
    : "text-grey-8 text-bold";
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
