<template>
  <q-list>
    <q-item
      class="flex items-center"
      v-for="(user, index) in filteredUsers"
      :key="user.email"
    >
      <div class="items-center row q-gutter-x-sm" style="flex: 1">
        <q-avatar :color="avatarColor(index)" text-color="white" size="42px">
          {{ initials(user.name) }}
        </q-avatar>
        <div class="text-black text-left">
          <div class="text-body1 text-weight-medium">
            {{ user.name }}
            <q-chip
              size="sm"
              outline
              :color="user.isAdmin ? 'positive' : 'secondary'"
              class="flex"
            >
              {{ user.isAdmin ? "Admin" : "Usuário" }}
            </q-chip>
          </div>
          <div class="text-grey text-subtitle1">
            {{ user.email + " • " + user.ramal_number }}
          </div>
        </div>
      </div>

      <q-btn
        round
        flat
        :icon="confirmDeleteId === user.id ? 'check' : 'delete'"
        @click="confirmDelete(user.id)"
      />
    </q-item>
  </q-list>
</template>
<script setup>
import { avatarColor, initials } from "./lib";
const props = defineProps({
  users: {
    type: Object,
    required: true,
  },
  confirmDeleteId: {
    type: String,
  },
});

const search = defineModel();

const emit = defineEmits(["deleteUser", "updateConfirmDeleteId"]);

const confirmDelete = (userId) => {
  props.confirmDeleteId === userId
    ? emit("deleteUser", userId)
    : emit("updateConfirmDeleteId", userId);
};

const filteredUsers = computed(() => {
  if (!Array.isArray(props.users)) return [];

  const list = !search.value
    ? [...props.users]
    : props.users.filter((u) => {
        const searchTerm = search.value.toLowerCase();
        return (
          u.name?.toLowerCase().includes(searchTerm) ||
          u.email?.toLowerCase().includes(searchTerm)
        );
      });

  return list.reverse();
});
</script>
