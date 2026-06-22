<template>
  <div class="flex-center row">
    <q-card class="flex my-card q-mt-lg row">
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
  const result = await runQuery<{ getAllFolders?: FileSystemItem[] }>(
    GetAllFolders,
  );
  fileStorage.setAllFolders(result?.getAllFolders ?? []);
  fileStorage.resetSelectedFields();
});

watchEffect(async () => {
  if (fileStorage.getFoldersAgain) {
    const result = await runQuery<{ getAllFolders?: FileSystemItem[] }>(
      GetAllFolders,
    );
    fileStorage.setAllFolders(result?.getAllFolders ?? []);
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

@media (max-width: 1023px) {
  .my-card {
    min-width: 0;
    min-height: 0;
    height: 70vh;
  }
}

@media (max-width: 599px) {
  .my-card {
    height: auto;
    overflow: visible;
  }
}
</style>
