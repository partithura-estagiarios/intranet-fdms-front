<template>
  <q-dialog v-model="props.open" persistent>
    <q-card>
      <q-form @submit="optionRamal">
        <q-card-section
          class="custom-color font-custom row justify-between text-white"
        >
          <div class="q-pa-md text-h5">{{ $t("text." + props.option) }}</div>
          <q-icon
            name="close"
            class="pt-2 cursor-pointer"
            size="45px"
            @click="emits('close', false)"
          />
        </q-card-section>
        <div v-if="props.option != 'deleteRamal'">
          <q-card-section>
            <q-input
              white
              v-model="labelDefinite.sector"
              :label="$t(`formRamal.nameOfRamal`)"
              type="text"
              :rules="[(val) => validateNotEmpty(val)]"
            />
          </q-card-section>

          <q-card-section class="row justify-between no-wrap overflow-hidden">
            <div class="pr-12 col-7">
              <q-input
                white
                class="no-padding"
                v-model="labelDefinite.number"
                :label="$t(`formRamal.numberOfRamal`)"
                type="number"
                :rules="[(val) => validateNotEmpty(val)]"
              />
            </div>
            <div class="pl-12 col-5">
              <q-input
                white
                v-model="labelDefinite.name"
                :label="$t(`formRamal.userOfRamal`)"
                type="text"
                :rules="[(val) => validateNotEmpty(val)]"
              />
            </div>
          </q-card-section>
        </div>
        <div v-else>
          <q-card-section class="text-grey font-custom">
            {{ $t("formRamal.deleteRamalMessage.mainMessage") }}
            {{ labelDefinite.number }}
            {{ $t("formRamal.deleteRamalMessage.auxMessage") }} {{
            }}{{ labelDefinite.name }}
            {{ $t("formRamal.deleteRamalMessage.auxMessage1") }}
            {{ labelDefinite.sector }}
          </q-card-section>
        </div>
        <q-card-actions
          align="right"
          class="pt-12 pa-5 text-green-8 font-custom"
        >
          <q-btn flat :label="$t('formRamal.confirm')" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import AddRamal from "../../../graphql/ramais/AddRamal.gql";
import DeleteRamal from "../../../graphql/ramais/DeleteRamal.gql";
import EditRamal from "../../../graphql/ramais/EditRamal.gql";
import { useFieldValidation } from "../../../composables/rules";
import { resetFields } from "./lib";

const { validateNotEmpty } = useFieldValidation();
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  option: {
    type: String,
    required: true,
  },
  ramal: {
    type: Object,
    required: false,
  },
});
const { t } = useI18n();
const emits = defineEmits(["close"]);
const label = reactive({
  id: "",
  sector: "",
  number: "",
  name: "",
});
const labelDefinite = computed(() => {
  return props.ramal ?? label;
});

const optionRamal = async () => {
  switch (props.option) {
    case "addRamal":
      const { id, ...newRamal } = labelDefinite.value;
      return runMutation(AddRamal, {
        newRamal: newRamal,
      })
        .then(() => {
          resetFields(labelDefinite.value);
          emits("close");
          positiveNotify(t("sucessRamal." + props.option));
        })
        .catch(() => {
          negativeNotify(t("erroRamal." + props.option));
        });

    case "editRamal":
      return runMutation(EditRamal, { ramal: labelDefinite.value })
        .then(() => {
          emits("close");
          positiveNotify(t("sucessRamal." + props.option));
        })
        .catch(() => {
          negativeNotify(t("erroRamal." + props.option));
        });

    case "deleteRamal":
      return runMutation(DeleteRamal, { id: labelDefinite.value.id })
        .then(() => {
          emits("close");
          positiveNotify(t("sucessRamal." + props.option));
        })
        .catch(() => {
          negativeNotify(t("erroRamal." + props.option));
        });

    default:
      return Promise.resolve();
  }
};
const deleteMessage = computed(() => {
  return t("formRamal.deleteRamalMessage", {
    numero: labelDefinite.value.number,
    nome: labelDefinite.value.name,
    setor: labelDefinite.value.sector,
  });
});
</script>
<style scoped>
.custom-color {
  background-color: rgb(31, 73, 125);
}
.font-custom {
  font-family: Fira Sans;
}
</style>
