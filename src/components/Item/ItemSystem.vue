<template>
  <q-icon
    :name="item.icon"
    clickable
    @click="modalCreateSystem"
    class="cursor-pointer position-icon"
    v-if="layout != 'ELYTE'"
  >
    <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
      {{ $t("action.systemModuleOptions") }}
    </q-tooltip>
    <MenuSystemOptions @activeDeleteSystem="changeItem((change = !change))" />
  </q-icon>
</template>

<script setup lang="ts">
import { useUsers } from "../../stores/user";
import { useSystems } from "../../stores/system";

const layout = computed(() => getLayout());

const userStorage = useUsers();
const systemStorage = useSystems();
const modalCreateSystem = ref();
const change = ref(false);
const editItem = {
  icon: "more_vert",
  label: "action.systemManager",
  subLabel: "action.systemModuleOptions",
};
const newItem = {
  icon: "delete",
  label: "action.deleteSystem",
  subLabel: "",
};
const item = ref(editItem);

function changeItem(val: boolean) {
  if (val) {
    systemStorage.toogleBadgeExclusion;
    return (item.value = newItem);
  }
  systemStorage.toogleBadgeExclusion;
  return (item.value = editItem);
}
</script>

<style scoped>
.border-color {
  border: 8px solid rgb(31, 73, 125);
}
.custom-color {
  color: rgb(31, 73, 125);
}
.font-custom {
  font-family: Fira Sans;
}
.icon-partithura {
  height: 5.7rem;
  bottom: 0.35rem;
}
.position-icon {
  bottom: 0.2rem;
}
</style>
