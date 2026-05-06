<template>
  <q-img src="/INTRANET_FUNDIMISA.png" class="fixed-full absolute" />

  <div class="fixed-center column">
    <div class="row">
      <q-card class="justify-center shadow-1 my-card q-pa-xl bordered">
        <q-card-section vertical class="q-gutter-md" align="center">
          <q-avatar rounded size="150px">
            <img src="ico/ICO_FUNDIMISA.png" />
          </q-avatar>
          <p class="text-black text-bold text-h4">INTRANET FUNDIMISA</p>
        </q-card-section>
        <q-card-section vertical class="q-gutter-md" align="center">
          <h5 class="text-bold text-subtitle1">
            {{ $t("login.enterYourCredentials") }}
          </h5>
          <div class="q-gutter-md">
            <Input :objectInput="loginForm" @dataLogin="handleDataLogin" />
          </div>
          <br />
        </q-card-section>
        <q-card-actions class="q-px-md">
          <q-btn
            color="green-8"
            size="lg"
            class="relative-position envy full-width"
            :label="$t('login.submitButton')"
            nelevated
            rounded
            @click="submitLoginForm"
          />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from "../../entities/login";
import { useUsers } from "../../stores/user";

const router = useRouter();

interface Auth {
  auth: {
    email: string;
    password: string;
    name: string;
    token: string;
    id: string;
  };
}

const userStorage = useUsers();
const { t } = useI18n();
const loginForm: User = reactive({
  labelEmail: "",
  labelInputPassword: "",
});
const handleDataLogin = (form: User) => {
  Object.assign(loginForm, form);
};

const submitLoginForm = async () => {
  const auth: Auth = await userStorage.getUser(loginForm);

  if (auth.auth) {
    userStorage.stateUser = auth;

    router.push("/home");
    return positiveNotify(t("login.loginSuccessful"));
  }
  return negativeNotify(t("auth.invalidCredentials"));
};
</script>

<style scoped>
.underline {
  text-decoration: underline;
}
</style>
