<template>
  <q-card bordered class="text-black q-pa-md">
    <div class="justify-between items-center q-mb-md row">
      <q-badge outline class="text-grey-7 text-subtitle1 text-weight-medium">
        {{ data.users.length }} Usuários
      </q-badge>
      <q-btn @click="alert = true" flat icon="add_moderator"></q-btn>
      <q-dialog v-model="alert">
        <q-card style="width: 500px" class="text-black">
          <q-card-section>
            <div class="text-h6">Cadastro Administrador</div>
          </q-card-section>
          <q-form greedy @submit.prevent="onSubmit">
            <q-card-section>
              <q-input
                v-for="input in formFields"
                v-model="data[input.key]"
                class="mb-3"
                :rules="[
                  (val) =>
                    (val && val.length > 0) ||
                    `${input.placeholder} é requerido`,
                ]"
                outlined
                :placeholder="input.placeholder"
                :type="input.type"
              >
              </q-input>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Salvar" type="submit" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>
    </div>
    <q-input v-model="search" dense outlined class="q-mb-md">
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    <AdminListItems
      :confirm-delete-id="confirmDeleteId"
      @delete-user="deleteUser($event)"
      @update-confirm-delete-id="confirmDeleteId = $event"
      @update-users="data.users = $event"
      v-model="search"
      :users="data.users"
    />
  </q-card>
</template>
<script setup>
import AdminListItems from "./AdminListItems.vue";
import { formFields } from "./lib.js";

const user = useUsers();

const data = reactive({
  users: [],
  close: false,
  name: "",
  email: "",
  password: "",
  isAdmin: true,
  ramal_number: null,
});

const search = ref("");
const alert = ref(false);
const confirmDeleteId = ref(null);

const onSubmit = async () => {
  const dataToSend = {
    email: data.email,
    password: data.password,
    name: data.name,
    isAdmin: data.isAdmin,
    ramal_number: Number(data.ramal_number),
    user_registration: 0,
  };
  try {
    await user.AddNewUser(dataToSend);
    data.users = await user.getAllUsers();
    positiveNotify("Usuário adicionado com successo");
  } catch (error) {
    negativeNotify(error);
  }

  data.name = "";
  data.email = "";
  data.password = "";
  data.ramal_number = null;
  alert.value = false;
};

const deleteUser = async (userId) => {
  try {
    await user.deleteUser(userId);
    data.users = await user.getAllUsers();
    confirmDeleteId.value = null;
    return positiveNotify("Usuário deletado com successo");
  } catch {
    return negativeNotify("Erro ao deletar um usuário");
  }
};

onMounted(async () => {
  data.users = await user.getAllUsers();
});
</script>
