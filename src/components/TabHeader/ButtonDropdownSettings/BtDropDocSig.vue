<template>
  <q-btn
    class="font-custom text-h6 text-white"
    no-caps
    :label="$t('tab.gisDocumentation')"
    flat
    :class="tabClass()"
    v-if="layout != 'ELYTE'"
  >
    <q-menu class="z-top text-black">
      <q-list>
        <q-item
          clickable
          v-close-popup
          v-for="opt in options"
          :key="opt"
          @click="selectOption(opt)"
        >
          <q-item-section>
            <q-item-label class="q-mx-xl">{{
              removeCharacterSpecial(opt)
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { useSystems } from "../../../stores/system";
import { useRoute } from "vue-router";

const { t } = useI18n();
const route = useRoute();
const options = ["/processes", "/institutional"];
const systemStorage = useSystems();

const layout = computed(() => getLayout());

function removeCharacterSpecial(rout: string) {
  const parts = rout.split("/");
  return t(`tab.${parts.join("")}`);
}

function tabClass() {
  if (options.includes(route.fullPath)) {
    return layout.value === "CIRON"
      ? "text-orange-14 bg-white rounded-borders"
      : "text-green bg-white rounded-borders";
  }
}
function selectOption(opt: string) {
  systemStorage.goToRoute(opt);
}
</script>

<style scoped>
.font-custom {
  font-family: Fira Sans;
}
</style>
