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

    <q-input
      v-model="search"
      dense
      outlined
      placeholder="Buscar por nome ou e-mail..."
      class="q-mb-md"
    >
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>

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
          @click="
            confirmDeleteId === user.id
              ? deleteUser(user.id)
              : (confirmDeleteId = user.id)
          "
        />
      </q-item>
    </q-list>
  </q-card>
</template>
<script setup>
const user = useUsers();

const formFields = [
  {
    key: "name",
    placeholder: "Nome",
    type: "text",
  },
  {
    key: "email",
    placeholder: "Email",
    type: "text",
  },
  {
    key: "password",
    placeholder: "Senha",
    type: "password",
  },
  {
    key: "ramal_number",
    placeholder: "Ramal",
    type: "number",
  },
];

const data = reactive({
  users: [],
  close: false,
  name: "",
  email: "",
  password: "",
  isAdmin: true,
  ramal_number: null,
});

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

const search = ref("");
const alert = ref(false);
const confirmDeleteId = ref(null);

const avatarColors = ["primary", "secondary", "accent", "positive", "negative"];
const avatarColor = (i) => avatarColors[i % avatarColors.length];

const initials = (name) => {
  const parts = name.trim().split(" ");
  return parts[0][0].toUpperCase();
};

const filteredUsers = computed(() => {
  if (!Array.isArray(data.users)) return [];

  const list = !search.value
    ? [...data.users]
    : data.users.filter((u) => {
        const searchTerm = search.value.toLowerCase();
        return (
          u.name?.toLowerCase().includes(searchTerm) ||
          u.email?.toLowerCase().includes(searchTerm)
        );
      });

  return list.reverse();
});
</script>
