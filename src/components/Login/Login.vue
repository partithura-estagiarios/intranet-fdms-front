<template>
  <q-img src="/INTRANET_FUNDIMISA.png" class="absolute fixed-full" />

  <div class="column fixed-center">
    <div class="row">
      <q-card class="my-card q-pa-xl shadow-1 justify-center bordered">
        <q-card-section vertical class="q-gutter-md" align="center">
          <q-avatar rounded size="150px">
            <img src="ico/ICO_FUNDIMISA.png" />
          </q-avatar>
          <p class="text-bold text-black text-h4">INTRANET FUNDIMISA</p>
        </q-card-section>
        <q-card-section vertical class="q-gutter-md" align="center">
          <h5 class="text-subtitle1 text-bold">
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
            class="envy full-width relative-position"
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
import { router } from "../../modules";
import { useUsers } from "../../stores/user";

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
  const auth = await userStorage.getUser(loginForm);
  console.log("erro", auth);
  if (auth) {
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
