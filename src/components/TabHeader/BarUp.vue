<template>
  <q-toolbar :class="toolbarClass">
    <q-btn flat to="/home" class="q-py-sm q-px-md self-center">
      <img :src="logo" class="logo-img" />
    </q-btn>

    <div class="row">
      <q-tabs
        v-model="tab"
        indicator-color="transparent"
        class="font-route-tab text-white"
        v-for="item in tabItems"
      >
        <q-btn
          :class="tabClass(item.name)"
          no-caps
          @click="goToRoute(item.name)"
          flat
          size="1.2rem"
          class="q-py-xs padding-custom-btn"
          dense
          :label="$t(`tab.${item.label}`)"
        />
      </q-tabs>
      <BtDropDocSig />
    </div>

    <div class="row self-center q-py-md q-px-sm">
      <BtDropSet />
    </div>
  </q-toolbar>
</template>

<script setup lang="ts">
import { tabItems } from "./lib";
import { router } from "../../modules/router";

const tab = ref("home");

const layout = computed(() => getLayout());

const logo = computed(() =>
  layout.value === "CIRON" ? "/LOGO_CIRON.png" : "/ico/LOGO_FUNDIMISA.png",
);

const toolbarClass = computed(() => [
  "q-py-sm",
  "row",
  "justify-between",
  layout.value === "CIRON" ? "bg-black" : "color-custom",
]);

function tabClass(itemName: string) {
  if (`/${itemName}` !== router.currentRoute.value.path) return;

  return layout.value === "CIRON"
    ? "text-orange-14 bg-white rounded-borders"
    : "text-green bg-white rounded-borders";
}

function goToRoute(rout: string) {
  if (rout === "docSig") {
  }
  return router.push(`/${rout}`);
}
onMounted(() => {
  goToRoute("home");
});
</script>

<style scoped>
.font-route-tab {
  font-family: Fira Sans;
}
.logo-img {
  height: 60px;
  width: auto;
  max-width: 300px;
  display: block;
  object-fit: contain;
}

.color-custom {
  background-color: rgb(31, 73, 125);
}

.padding-custom-btn {
  padding-inline: 1rem;
}
</style>
