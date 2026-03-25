<template>
  <q-card class="my-card">
    <q-card-section horizontal>
      <q-card-section>
        <div class="row items-center justify-between q-mb-sm" v-if="isLogged">
          <span class="text-caption text-grey">{{ $t("tab.folders") }}</span>
          <q-btn flat round icon="settings" color="grey" size="sm">
            <q-menu>
              <q-list class="text-black bg-white menu-list">
                <q-item clickable v-close-popup @click="openAddFolderDialog">
                  <q-item-section>{{ $t("action.addFolder") }}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="triggerUpload">
                  <q-item-section>{{ $t("action.addImage") }}</q-item-section>
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
        <ImgsInstitutional :folders="allFolders" :name="computedTitleImg" />
      </q-card-section>
    </q-card-section>
  </q-card>
  <CardAddFolderInst
    :card="cardAddFolder"
    @update-card-folder="cardAddFolder = $event"
  />
  <input
    ref="uploadInput"
    :type="inputType"
    :accept="acceptedFiles"
    class="hidden-input"
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
const inputType = ref("file");
const acceptedFiles = ref("image/*");
const computedTitleImg = computed(() => titleImg.value);
const isLogged = computed(() => userStorage.getToken);

function openAddFolderDialog() {
  cardAddFolder.value = true;
}

async function loadAllDocsInt() {
  const { getAllImgs }: { getAllImgs: FoldersIntitutional[] } =
    await runQuery(GetAllImgs);
  allFolders.value = createPath(getAllImgs);
  namesOfImgs.value = getAllImgs.map((folder) => folder.name);
  imgsStorage.setFoldersImgs(namesOfImgs.value);
  titleImg.value = namesOfImgs.value[0] || "";
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
    return;
  }
  negativeNotify("Erro ao adicionar imagem.");
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
.hidden-input {
  display: none;
}
.menu-list {
  min-width: 150px;
}
</style>
