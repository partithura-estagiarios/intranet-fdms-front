<template>
  <Separator :texto="$t('tab.extensions')" />
  <div class="q-px-md box-shadow q-mx-xl bg-white">
    <HeaderRamais />
    <q-table
      :rows="ramaisStorage.getAllRamais || []"
      :columns="columns as Column[]"
      flat
      hide-bottom
      v-model:pagination="pagination"
    >
      <template v-slot:header-cell="props">
        <q-th :props="props" class="text-indigo">
          {{ $t(`${props.col.label}`) }}
        </q-th>
      </template>
      <template v-slot:body-cell-icon="props">
        <q-td :props="props">
          <q-avatar v-if="userStorage.getToken">
            <DropdownSettings
              :options="['deleteRamal', 'editRamal']"
              :ramal="props.row"
            />
          </q-avatar>
        </q-td>
      </template>
      <template v-slot:body-cell="props">
        <q-td :props="props" class="text-grey">
          {{ $t(`columns.${props.value}`, props.value) }}
        </q-td>
      </template>
    </q-table>
    <q-separator />
    <Pagination class="text-right" />
    <SeparatorForEmergence
      :texto="'400 RAMAL DE EMERGÊNCIA'"
      :large="'410px'"
    />
  </div>
</template>

<script setup lang="ts">
import { useUsers } from "../../stores/user";
import { useRamais } from "../../stores/ramais";
import { columns, pagesOfTable } from "./lib";
import { Column } from "../../entities/column";

const pagination = ref({
  rowsPerPage: pagesOfTable,
});
const userStorage = useUsers();
const ramaisStorage = useRamais();
</script>

<style scoped>
.box-shadow {
  box-shadow:
    0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 15px;
  margin-top: -1.5rem;
}
</style>
