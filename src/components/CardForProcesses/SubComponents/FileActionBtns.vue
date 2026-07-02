<template>
  <div class="q-px-sm col-auto border-b flex justify-end">
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
defineEmits(["add"]);
</script>
<style scoped>
.border-b {
  border-bottom: 1px solid rgba(44, 44, 44, 0.2);
}
</style>
