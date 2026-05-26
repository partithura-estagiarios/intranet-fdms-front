<template>
  <q-card bordered class="text-black q-pa-md">
    <div class="justify-between items-center q-mb-md row">
      <q-badge outline class="text-black text-subtitle1 text-weight-medium">
        Usuários {{ data.users.length }}
      </q-badge>
      <q-btn @click="alert = true" outline icon="add_moderator"></q-btn>
      <q-dialog v-model="alert">
        <q-card style="width: 500px" class="text-black">
          <q-card-section>
            <div class="text-h6">Cadastro Administrador</div>
          </q-card-section>
          <q-form greedy @submit.prevent="onSubmit">
            <q-card-section>
              <q-input
                v-model="data.name"
                class="mb-3"
                :rules="[
                  (val) => (val && val.length > 0) || 'Nome é requerido',
                ]"
                outlined
                placeholder="Nome"
              ></q-input>
              <q-input
                v-model="data.email"
                class="mb-3"
                :rules="[
                  (val) => (val && val.length > 0) || 'Email é requerido',
                ]"
                outlined
                placeholder="Email"
              ></q-input>
              <q-input
                class="mb-3"
                v-model="data.password"
                :rules="[
                  (val) => (val && val.length > 0) || 'Senha é requerido',
                ]"
                outlined
                placeholder="Senha"
              ></q-input>
              <q-input
                type="number"
                v-model.number="data.ramal_number"
                outlined
                :rules="[(val) => val || 'Ramal é requerido']"
                placeholder="Ramal"
              ></q-input>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                flat
                label="Salvar"
                v-close-popup
                type="submit"
                color="primary"
              />
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
            </div>
            <div class="text-grey text-subtitle1">
              {{ user.email + " • " + user.ramal_number }}
            </div>
          </div>
        </div>

        <q-chip
          outline
          :color="user.isAdmin ? 'positive' : 'secondary'"
          class="flex"
        >
          {{ user.isAdmin ? "Admin" : "Usuário" }}
        </q-chip>
      </q-item>
    </q-list>
  </q-card>
</template>
<script setup>
const user = useUsers();

const data = reactive({
  users: [],
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
    ramal_number: data.ramal_number,
    user_registration: 0,
  };
  await user.AddNewUser(dataToSend);

  data.users = await user.getAllUsers();

  data.name = "";
  data.email = "";
  data.password = "";
  data.ramal_number = null;
};

onMounted(async () => {
  data.users = await user.getAllUsers();
});

const search = ref("");
const alert = ref(false);

const avatarColors = ["primary", "secondary", "accent", "positive", "negative"];
const avatarColor = (i) => avatarColors[i % avatarColors.length];

const initials = (name) => {
  const parts = name.trim().split(" ");
  return parts[0][0].toUpperCase();
};

const filteredUsers = computed(() => {
  if (!Array.isArray(data.users)) return [];

  if (!search.value) return data.users;

  return data.users.filter((u) => {
    const searchTerm = search.value.toLowerCase();

    const match =
      u.name?.toLowerCase().includes(searchTerm) ||
      u.email?.toLowerCase().includes(searchTerm);

    return match;
  });
});
const props = defineProps({
  users: { type: Array },
});
</script>
