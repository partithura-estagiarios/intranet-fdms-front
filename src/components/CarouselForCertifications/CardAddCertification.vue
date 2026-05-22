<template>
  <q-dialog v-model="props.card">
    <q-card class="my-card">
      <q-form @submit="addFolder()">
        <DialogHeader
          @close="closeDialog"
          :option="$t('tab.addCertifications')"
        />

        <q-card-section
          ><InputsForCertification
            @envity-all-inputs="
              (val1: number, val2: string, val3: File) => {
                numberCert = val1;
                nameCert = val2;
                img = val3;
              }
            "
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            :color="buttonColor"
            :label="$t('formRamal.confirm')"
            type="submit"
            clickable
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { addCertifcation } from "./lib";

const { notifyResponse } = useNotify();

const emits = defineEmits(["update-card-folder"]);
const nameCert = ref();
const numberCert = ref();
const img = ref();

const props = defineProps({
  card: {
    type: Boolean,
    required: true,
  },
});
function closeDialog() {
  emits("update-card-folder", false);
}
async function addFolder() {
  const result = await addCertifcation(
    nameCert.value,
    numberCert.value,
    img.value,
  );
  const ok = notifyResponse(result);
  if (ok) {
    closeDialog();
  }
}

const layout = computed(() => getLayout());

const buttonColor = computed(() =>
  layout.value === "CIRON" ? "orange-14" : "green",
);
</script>
