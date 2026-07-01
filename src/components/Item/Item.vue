<template>
  <div
    class="mt-5 row"
    :class="$q.screen.lt.lg ? 'justify-between' : 'justify-center'"
  >
    <div v-for="item in systems" :key="item.system_id">
      <q-item
        :clickable="!systemStorage.getBadgeExclusion"
        @click="systemStorage.goToRoute(item.link)"
      >
        <q-item-section class="border-radius-inherit">
          <q-avatar
            :class="[
              'border-color',
              'row',
              'bg-white',
              'shadow-14',
              accentClass,
            ]"
            size="7.99rem"
          >
            <q-badge
              color="red cursor-pointer"
              floating
              v-if="systemStorage.getBadgeExclusion"
              :clickable="systemStorage.getBadgeExclusion"
              @click.stop="systemStorage.excludeSystemId(item.system_id)"
            >
              <q-icon name="delete" size="sm" />
            </q-badge>
            <q-icon
              :name="item.icon"
              :class="[accentClass, 'icon-partithura', 'q-py-md']"
            />
          </q-avatar>
        </q-item-section>
        <div class="text-start label row">
          <q-item>
            <q-item-section>
              <q-item-label
                :class="[
                  accentClass,
                  'text-h5',
                  'text-weight-bolder',
                  'font-custom',
                ]"
              >
                {{ item.label }}
              </q-item-label>

              <q-item-label
                :class="[highlightClass, 'text-bold', 'text-h5', 'font-custom']"
              >
                {{ item.sublabel }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-item>
    </div>
  </div>

  <DialogContatDirector
    @close="systemStorage.openModalCeo = false"
    :open="systemStorage.openModalCeo"
  />
</template>

<script setup lang="ts">
import { useSystems } from "../../stores/system";

const systemStorage = useSystems();
const props = defineProps({
  sistema: {
    type: String,
    required: true,
  },
});

const layout = computed(() => getLayout());

const accentClass = computed(() =>
  layout.value === "CIRON" ? "text-black" : "custom-color-label",
);

const highlightClass = computed(() =>
  layout.value === "CIRON" ? "text-orange-14" : "text-green",
);
const systems = computed(() => {
  if (layout.value === "ELYTE") {
    return systemStorage.getSistemas.filter(
      (x) => x.label == "Partithura" || x.label == "Ramais",
    );
  }
  return systemStorage.getSistemas;
});

onMounted(async () => {
  systemStorage.loadSystems(props.sistema);
});
</script>

<style scoped>
.border-color {
  border: 8px solid currentColor;
}
.custom-color-label {
  color: rgb(31, 73, 125);
}
.font-custom {
  font-family: Fira Sans;
}
.icon-partithura {
  height: 5.7rem;
  bottom: 0.35rem;
}
</style>
