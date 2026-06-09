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
              :color="isUserAdmin(user).color"
              class="flex"
            >
              {{ isUserAdmin(user).name }}
            </q-chip>
          </div>
          <div class="text-grey text-subtitle1">
            {{ emailRamalTemplate(user) }}
          </div>
        </div>
      </div>

      <q-btn round flat icon="edit" @click="getUserId(user.id)" />
      <q-btn
        round
        flat
        :icon="confirmDeleteId === user.id ? 'check' : 'delete'"
        @click="confirmDelete(user.id)"
      />
    </q-item>
  </q-list>

  <q-dialog v-model="alert">
    <q-card style="width: 500px" class="text-black">
      <q-card-section>
        <div class="text-h6">Edição Administrador</div>
      </q-card-section>
      <q-form greedy @submit.prevent="onEditUsers">
        <q-card-section>
          <q-input
            :label="input.placeholder"
            v-for="input in filteredFields"
            v-model="data[input.key]"
            class="mb-3"
            :rules="getInputRules(input)"
            outlined
            :type="input.type"
          >
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="SALVAR" type="submit" color="primary" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { avatarColor, initials, emailRegex } from "./lib";
import { formFields } from "./lib";

const props = defineProps({
  users: {
    type: Object,
    required: true,
  },
  confirmDeleteId: {
    type: String,
  },
});
const emit = defineEmits([
  "deleteUser",
  "updateConfirmDeleteId",
  "updateUsers",
]);

const user = useUsers();
const alert = ref(false);
const userIdValue = ref(null);
const users = ref([]);

const data = reactive({
  name: "",
  email: "",
  password: "",
});

const getUserId = (userId) => {
  userIdValue.value = userId;

  const currentUser = props.users.find((u) => u.id === userId);

  if (currentUser) {
    data.name = currentUser.name || "";
    data.email = currentUser.email || "";
    data.password = "";
    alert.value = true;
  }
};

const onEditUsers = async () => {
  const originalUser = props.users.find((u) => u.id === userIdValue.value);

  if (!originalUser) return;

  const dataToEdit = {};

  if (data.name && data.name !== originalUser.name) {
    dataToEdit.name = data.name;
  }

  if (data.email && data.email !== originalUser.email) {
    dataToEdit.email = data.email;
  }

  if (data.password && data.password.trim() !== "") {
    dataToEdit.password = data.password;
  }

  if (Object.keys(dataToEdit).length === 0) {
    positiveNotify("Nenhuma alteração foi realizada.");
    alert.value = false;
    return;
  }

  try {
    await user.editUser(userIdValue.value, dataToEdit);
    users.value = await user.getAllUsers();
    emit("updateUsers", users.value);
    positiveNotify("Usuário editado com sucesso");
  } catch (error) {
    negativeNotify(error);
  }

  data.name = "";
  data.email = "";
  data.password = "";
  alert.value = false;
};

const search = defineModel();

const confirmDelete = (userId) => {
  props.confirmDeleteId === userId
    ? emit("deleteUser", userId)
    : emit("updateConfirmDeleteId", userId);
};

const emailRamalTemplate = (user) => {
  return user.email + " • " + user.ramal_number;
};
const isUserAdmin = (user) => {
  return {
    name: user.isAdmin ? "Admin" : "Usuário",
    color: user.isAdmin ? "positive" : "secondary",
  };
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

const filteredFields = computed(() =>
  formFields.filter((x) => x.key != "ramal_number"),
);

const getInputRules = (input) => {
  if (input.key === "email") {
    return [
      (val) => !!val || "O e-mail é obrigatório",
      (val) => emailRegex.test(val) || "Por favor, insira um e-mail válido",
    ];
  }
};
</script>
