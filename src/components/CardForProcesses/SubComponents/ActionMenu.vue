<template>
  <q-item-section v-if="useUser.getToken" side @click.stop>
    <q-btn flat round dense icon="more_vert" :color="iconColor">
      <q-menu auto-close>
        <q-list>
          <q-item clickable @click="$emit('edit', item)">
            <q-item-section avatar class="q-pr-sm min-w-0">
              <q-icon name="edit" color="primary" size="sm" />
            </q-item-section>
            <q-item-section class="text-black text-body2">{{
              $t("action.edit")
            }}</q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable @click="$emit('delete', item)">
            <q-item-section avatar class="q-pr-sm min-w-0">
              <q-icon name="delete" color="negative" size="sm" />
            </q-item-section>
            <q-item-section class="text-negative text-body2">{{
              $t("action.delete")
            }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-item-section>
</template>

<script setup lang="ts">
const useUser = useUsers();
defineProps({
  item: {
    type: Object,
    required: true,
  },
  iconColor: {
    type: String,
    default: "grey-7",
  },
});

defineEmits(["edit", "delete"]);
</script>
