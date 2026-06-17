<template>
  <div class="size">
    <q-img :src="getImageUrl(img)" />
  </div>
</template>

<script setup lang="ts">
import { server_express_url } from "../lib";
const props = defineProps({
  img: {
    type: String,
    required: true,
  },
});
const getImageUrl = (imageName: string) => {
  return `${server_express_url}/serve-image/${encodeURIComponent(imageName)}`;
};
</script>

<style scoped></style>
