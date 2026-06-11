<template>
  <q-dialog v-model="props.card">
    <q-card class="my-card w-full">
      <DialogHeader @close="(val) => emits('close')" :option="label" />
      <FormModalSystem @receveid="(val) => (form = val)" />
      <q-card-actions align="right">
        <q-btn
          v-close-popup
          flat
          type="submit"
          :color="buttonColor"
          :label="$t('action.confirm')"
          class="font-custom"
          @click="createSystem"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { InputSystem } from "../../../entities/system";
import CreateSystem from "../../../graphql/system/CreateSystem.gql";
import { useSystems } from "../../../stores/system";

const systemStorage = useSystems();
const emits = defineEmits(["receveid", "close"]);
const { t } = useI18n();
const props = defineProps({
  card: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
});
const form = ref<InputSystem>();
const createSystem = () => {
  if (form.value && systemStorage.verifyFields(form.value)) {
    runMutation(CreateSystem, { newSystem: form.value }).then((res: any) => {
      if (res.createSystem.enum) {
        systemStorage.loadSystems("gestao");
        emits("close");
        return positiveNotify(t(res.createSystem.message));
      }
      negativeNotify(t(res.createSystem.message));
    });
    return;
  }
  negativeNotify(t("errors.fillAllFields"));
};
const layout = computed(() => getLayout());

const buttonColor = computed(() =>
  layout.value === "CIRON" ? "orange-14" : "green",
);
</script>
<style scoped>
.font-custom {
  font-family: Fira Sans;
}
</style>
