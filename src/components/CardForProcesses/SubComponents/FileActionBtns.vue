<template>
  <div class="q-px-sm col-auto border-b flex justify-between">
    <div
      v-if="useUser.getToken"
      class="flex row q-gutter-x-sm q-my-sm text-grey-8"
    >
      <q-btn
        v-if="hasSelectedItem"
        no-wrap
        class="rounded-borders text-bold text-lowercase"
        icon="mdi-open-in-new"
        @click="$emit('open')"
      >
        <div class="q-ml-sm">{{ $t("action.open") }}</div>
      </q-btn>
      <q-btn
        v-if="hasSelectedItem"
        no-wrap
        class="rounded-borders text-bold text-lowercase"
        icon="mdi-pencil"
        @click="$emit('edit')"
      >
        <div class="q-ml-sm">{{ $t("action.edit") }}</div>
      </q-btn>
      <q-btn
        v-if="hasSelectedItem"
        no-wrap
        class="rounded-borders text-bold text-lowercase"
        icon="mdi-delete"
        @click="$emit('delete')"
      >
        <div class="q-ml-sm">{{ $t("action.delete") }}</div>
      </q-btn>
    </div>
    <q-btn
      v-if="useUser.getToken"
      no-wrap
      class="q-my-sm rounded-borders bg-grey-3"
      v-ripple
      @click="$emit('add')"
    >
      <q-icon name="add_circle_outline" color="grey-8" size="sm" />

      <div class="q-ml-sm text-grey-8 text-bold text-lowercase">
        {{ $t("files.newItem") }}
      </div>
    </q-btn>
  </div>
</template>
<script setup>
const useUser = useUsers();
defineEmits(["open", "edit", "delete", "add"]);
defineProps({
  hasSelectedItem: {
    type: Boolean,
    default: false,
  },
});
</script>
<style scoped>
.border-b {
  border-bottom: 1px solid rgba(44, 44, 44, 0.2);
}
</style>
