<template>
  <div class="row flex-center">
    <q-card class="my-card flex row">
      <RootFolders />

      <SubFolders />

      <ShowArchives />
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { FileSystemItem } from "../../entities/files";
import GetAllFolders from "../../graphql/folders/GetAllFolders.gql";
import { useFiles } from "../../stores/files";

const fileStorage = useFiles();

onMounted(async () => {
  const { getAllFolders }: { getAllFolders: FileSystemItem[] } =
    await runQuery(GetAllFolders);
  fileStorage.setAllFolders(getAllFolders);
  fileStorage.resetSelectedFields();
});

watchEffect(async () => {
  if (fileStorage.getFoldersAgain) {
    const { getAllFolders }: { getAllFolders: FileSystemItem[] } =
      await runQuery(GetAllFolders);
    fileStorage.setAllFolders(getAllFolders);
    fileStorage.getFoldersAgain = false;
  }
});
</script>

<style scoped>
.sidebar {
  background-color: rgb(31, 73, 125);
}

.my-card {
  width: 100%;
  max-width: 1600px;
  height: 75vh;
  min-height: 600px;
  min-width: 1024px;
  overflow: hidden;
}
</style>
