<template>
  <q-card-section>
    <q-input
      v-model="formSystem.label"
      stack-label
      :label="$t('text.label')"
      class="q-px-md"
      :rules="[(val) => (val && val.length > 0) || $t(`auth.fillField`)]"
    />
    <InputsIcons @receveid="(val) => (formSystem.icon = val)" />
  </q-card-section>
  <q-card-section class="">
    <q-input
      v-model="formSystem.sublabel"
      stack-label
      class="q-px-md"
      :label="$t('text.subLabel')"
      :rules="[(val) => (val && val.length > 0) || $t(`auth.fillField`)]"
    />
    <q-input
      v-model="formSystem.sistema"
      stack-label
      :label="$t('text.system')"
      class="q-px-md"
      disable
    />
  </q-card-section>
  <q-card-section>
    <q-input
      v-model="formSystem.link"
      stack-label
      label="Link"
      class="q-px-md"
      :rules="[(val) => (val && val.length > 0) || $t(`auth.fillField`)]"
    />
  </q-card-section>
</template>

<script setup lang="ts">
import { InputSystem } from "../../../entities/system";
const emits = defineEmits(["receveid"]);
const formSystem = reactive<InputSystem>({
  label: "",
  sublabel: "",
  icon: "",
  sistema: "gestao",
  link: "",
});
watchEffect(() => {
  return emits("receveid", formSystem);
});
</script>
