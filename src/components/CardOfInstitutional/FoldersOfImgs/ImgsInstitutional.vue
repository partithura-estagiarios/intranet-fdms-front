<template>
  <q-icon
    name="delete"
    color="black"
    size="md"
    v-if="userStorage.getToken && noImage"
    class="absolute-right cursor-pointer z-top"
    @click.stop="excludeDocInt(filteredImages[POSITION_IMG])"
  />
  <div v-if="filteredImages.length === FIRST_SLIDE && noImage">
    <CompontImg :img="filteredImages[POSITION_IMG]" />
  </div>
  <div v-if="filteredImages.length > FIRST_SLIDE">
    <q-carousel
      v-model="slide"
      prev-icon="arrow_circle_left"
      next-icon="arrow_circle_right"
      swipeable
      animated
      arrows
      thumbnails
      infinite
      control-color="green"
      class="carousel-image"
    >
      <q-carousel-slide v-for="(img, index) in filteredImages" :name="index">
        <CompontImg :img="img" />
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { FoldersIntitutional } from "../../../entities/imgsInstitutional";
import { useImgs } from "../../../stores/imgs";
import { useUsers } from "../../../stores/user";
import CompontImg from "./CompontImg.vue";

const userStorage = useUsers();
const imgsStorage = useImgs();
const FIRST_SLIDE = 1;
const POSITION_IMG = 0;
const props = defineProps({
  folders: {
    type: Array as () => FoldersIntitutional[],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});
const noImage = ref(false);
const slide = ref(FIRST_SLIDE);
const filteredImages = computed(() => {
  const folder = props.folders.find((folder) => folder.name === props.name);
  if (folder) {
    return folder.caminhos;
  }
  return [];
});

function excludeDocInt(item: string) {
  imgsStorage.excludeFolder(item);
}
watchEffect(() => {
  if (props.name) {
    if (filteredImages.value.length === 0) {
      return (noImage.value = false);
    }
    if (filteredImages.value[0].includes("null")) {
      return (noImage.value = false);
    }
    return (noImage.value = true);
  }
});
</script>
