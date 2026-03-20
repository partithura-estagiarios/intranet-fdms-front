<template>
  <q-card class="my-card">
    <q-card-section horizontal>
      <q-card-section>
        <div
          class="row items-center justify-between q-mb-sm"
          v-if="userStorage.getToken"
        >
          <span class="text-caption text-grey">Pastas</span>
          <q-btn flat round icon="settings" color="grey" size="sm">
            <q-menu>
              <q-list style="min-width: 150px" class="text-black bg-white">
                <q-item clickable v-close-popup @click="cardAddFolder = true">
                  <q-item-section>Criar pasta</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="triggerUpload">
                  <q-item-section>Adicionar imagem</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        <FoldersNamesImgs
          :foldersName="namesOfImgs"
          @envity-name="(val: string) => (titleImg = val)"
        />
      </q-card-section>
      <q-card-section class="col-19 flex flex-center">
        <ImgsInstitutional :folders="allFolders" :name="titleImg || ''" />
      </q-card-section>
    </q-card-section>
  </q-card>
  <CardAddFolderInst
    :card="cardAddFolder"
    @update-card-folder="cardAddFolder = $event"
  />
  <input
    ref="uploadInput"
    type="file"
    accept="image/*"
    style="display: none"
    @change="uploadImg"
  />
</template>

<script setup lang="ts">
import GetAllImgs from "../../graphql/institutionalImgs/GetAllImgs.gql";
import { FoldersIntitutional } from "../../entities/imgsInstitutional";
import { createPath } from "./lib";
import { useImgs } from "../../stores/imgs";
import { useUsers } from "../../stores/user";
import CardAddFolderInst from "./OptsCardSig/CardAddFolderInst/CardAddFolderInst.vue";

const imgsStorage = useImgs();
const userStorage = useUsers();
const namesOfImgs = ref<string[]>([]);
const allFolders = ref<any[]>([]);
const titleImg = ref();
const cardAddFolder = ref(false);
const menuOpen = ref(false);
const uploadInput = ref<HTMLInputElement | null>(null);

async function loadAllDocsInt() {
  const { getAllImgs }: { getAllImgs: FoldersIntitutional[] } =
    await runQuery(GetAllImgs);
  allFolders.value = createPath(getAllImgs);
  namesOfImgs.value = getAllImgs.map((folder) => folder.name);
  imgsStorage.setFoldersImgs(namesOfImgs.value);
  titleImg.value = namesOfImgs.value[0];
}

function triggerUpload() {
  uploadInput.value?.click();
}

async function uploadImg(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file || !titleImg.value) return;
  const result = await imgsStorage.insertImg(titleImg.value, file);
  if (result) {
    positiveNotify("Imagem adicionada com sucesso!");
    loadAllDocsInt();
  } else {
    negativeNotify("Erro ao adicionar imagem.");
  }
}

watchEffect(() => {
  if (imgsStorage.reload) {
    loadAllDocsInt();
    imgsStorage.refreshReload;
  }
});

onMounted(async () => {
  loadAllDocsInt();
});
</script>
<style scoped>
.my-card {
  height: 40rem;
}
</style>
