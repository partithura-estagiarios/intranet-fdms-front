<template>
  <div class="row scroll height-limit">
    <div v-for="item in foldersList">
      <q-item clickable v-ripple>
        <q-item-section @click="fileStorage.displayPdf(item)">
          <q-item-label
            ><q-icon name="mdi-file-pdf-box" size="3rem" color="black" />
          </q-item-label>
          <q-item-label
            class="font-title-pdf text-black"
            v-text="splitFileName(item)"
          />
          <q-item-label
            class="font-title-pdf text-black size-text"
            v-text="getNameMar(item)"
          />
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFiles } from "../../../stores/files";
import { splitFileName, getNameMar } from "../lib";

const fileStorage = useFiles();
const foldersList = ref();

watchEffect(() => {
  if (fileStorage.nameOfChild) {
    return (foldersList.value = fileStorage.getFoldersFiles);
  }
  return (foldersList.value = []);
});
</script>
<style scoped>
.font-title-pdf {
  font-family: Fira Sans;
  font-size: 0.9rem;
}
.height-limit {
  max-height: 35rem;
}
.size-text {
  width: 6rem;
}
</style>
