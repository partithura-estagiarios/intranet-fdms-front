<template>
  <div class="map-wrapper relative-position overflow-hidden">
    <!-- Container do Leaflet (Totalmente estável e isolado do Vue) -->
    <div
      :class="{ 'precision-cursor': showPreciseControl }"
      id="patio-map-container"
      class="map-canvas"
    ></div>

    <!-- CONTROLES FLUTUANTES DO QUASAR (Apenas interface em cima do Canvas) -->
    <div
      v-show="mapState === 'MICRO'"
      class="absolute-top-right q-ma-md custom-controls"
    >
      <q-card class="q-pa-sm bg-blur text-white shadow-5">
        <div class="text-subtitle2 q-mb-xs text-bold text-center">
          {{ selectedBuilding?.name }}
        </div>

        <!-- Seletor de Andares do Quasar -->
        <q-select
          v-model="activeFloor"
          :options="floorOptions"
          emit-value
          map-options
          dense
          dark
          outlined
          label="Selecione o Andar"
          @update:model-value="changeFloor"
        />

        <!-- Botão para voltar ao Pátio Geral -->
        <q-btn
          color="negative"
          icon="arrow_back"
          label="Sair do Prédio"
          size="sm"
          class="full-width q-mt-sm"
          @click="transitionToMacro"
        />
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, onBeforeUnmount } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMaps } from "~/stores/maps";

const mapStore = useMaps();

interface ConfigMapa {
  urlImagemAerea: string;
  larguraPixel: number;
  alturaPixel: number;
}

// --- CONFIGURAÇÃO DO AMBIENTE ---
const CONFIG_MAPA: ConfigMapa = {
  urlImagemAerea: "/area_fundimisa.svg", // Seu mapa do pátio principal externo
  larguraPixel: 44000,
  alturaPixel: 44000,
};

const endpoint_data = computed(() => {
  return mapStore.buildings.filter((building) => {
    return building.isActive;
  });
});

// --- ESTADOS REATIVOS DO VUE ---
const mapState = ref<"MACRO" | "MICRO">("MACRO");
const selectedBuilding = ref<any>();
const activeFloor = ref<number>(0);
const floorOptions = ref([]);

const showPreciseControl = ref(false);

// --- VARIÁVEIS DO LEAFLET (Livres de Proxies Reativos do Vue) ---
let mapInstance: L.Map | null = null;
let imagemFundoAtual: L.ImageOverlay | null = null;
let geometricLayerGroup: L.LayerGroup | null = null;
let clickTooltip: L.Tooltip | null = null;
function isModifierActive(e) {
  return e.ctrlKey || e.metaKey;
}

function handleKeyDown(e) {
  if (e.key === "Control" || e.key === "Meta") {
    showPreciseControl.value = true;
  }
}

function handleKeyUp(e) {
  if (e.key === "Control" || e.key === "Meta") {
    showPreciseControl.value = false;
  }
}

function placePositionMarker(e: L.LeafletMouseEvent, text: string = "") {
  const content = text
    ? text
    : `Y: ${Math.round(e.latlng.lat)}<br>X: ${Math.round(e.latlng.lng)}`;
  clickTooltip?.setLatLng(e.latlng).setContent(content).addTo(mapInstance);
}

const inicializarMapa = (): void => {
  const limitesImagem: L.LatLngBoundsExpression = [
    [0, 0],
    [CONFIG_MAPA.alturaPixel, CONFIG_MAPA.larguraPixel],
  ];

  mapInstance = L.map("patio-map-container", {
    crs: L.CRS.Simple,
    minZoom: -5,
    maxZoom: -1,
    maxBounds: limitesImagem,
    maxBoundsViscosity: 1.0,
    attributionControl: false,
  });

  // Cria e adiciona o container de vetores na tela
  geometricLayerGroup = L.layerGroup().addTo(mapInstance);

  // Executa a montagem inicial do pátio (Modo Macro)
  transitionToMacro();

  clickTooltip = L.tooltip({
    permanent: false, // Keeps the tooltip visible without requiring a hover state
    direction: "top", // Places the tooltip above the click point
    className: "coords-tooltip", // Optional custom styling class
  });

  // Seu capturador de cliques funcional para mapeamento
  mapInstance.on("click", (e: L.LeafletMouseEvent) => {
    if (isModifierActive(e.originalEvent)) {
      placePositionMarker(e);
    } else {
      clickTooltip?.remove();
    }
  });

  setTimeout(() => {
    if (mapInstance) {
      mapInstance.invalidateSize();
    }
  }, 100);
};

// --- MOTOR DE TRANSIÇÃO: PÁTIO GERAL (MACRO) ---
const transitionToMacro = (): void => {
  if (!mapInstance || !geometricLayerGroup) return;

  mapState.value = "MACRO";

  // Limpa backgrounds e salas anteriores
  if (imagemFundoAtual) mapInstance.removeLayer(imagemFundoAtual);
  geometricLayerGroup.clearLayers();

  const limitesImagem: L.LatLngBoundsExpression = [
    [0, 0],
    [CONFIG_MAPA.alturaPixel, CONFIG_MAPA.larguraPixel],
  ];

  mapInstance.setMaxBounds(limitesImagem);

  // Renderiza o mapa.png de fundo
  imagemFundoAtual = L.imageOverlay(
    CONFIG_MAPA.urlImagemAerea,
    limitesImagem,
  ).addTo(mapInstance);
  mapInstance.fitBounds(limitesImagem);

  endpoint_data.value.forEach((building) => {
    // 🔥 SUAS COORDENADAS REAIS DA FÁBRICA (Sem lacunas vazias para não quebrar o motor)
    const buildingVertices: L.LatLngTuple[] = building.outline;

    const buildingPolygon = L.polygon(buildingVertices, {
      ...building.config,
      bubblingMouseEvents: false,
    }).addTo(geometricLayerGroup);

    buildingPolygon
      .bindTooltip(building.name, {
        permanent: true,
        direction: "center",
        className: "polygon-label",
      })
      .openTooltip();

    buildingPolygon.on("click", (e) => {
      if (isModifierActive(e.originalEvent)) {
        placePositionMarker(e);
      } else {
        clickTooltip?.remove();
        floorOptions.value = building.floors;
        if (floorOptions.value?.length) {
          transitionToMicro(building, building.initialFloor || 0);
        } else {
          placePositionMarker(e, "Essa estrutura não possui áreas internas.");
        }
      }
    });
  });
};

// --- MOTOR DE TRANSIÇÃO: MAPA INTERNO (MICRO) ---
const transitionToMicro = (build: any, floorNumber: number): void => {
  if (!mapInstance || !geometricLayerGroup) return;

  mapState.value = "MICRO";
  selectedBuilding.value = build;
  activeFloor.value = floorNumber;

  if (imagemFundoAtual) mapInstance.removeLayer(imagemFundoAtual);
  geometricLayerGroup.clearLayers();

  const andarAlvo = floorOptions.value.find((f) => f.value === floorNumber);
  if (!andarAlvo) return;

  const limitesAndar: L.LatLngBoundsExpression = [
    [0, 0],
    [andarAlvo.height, andarAlvo.width],
  ];

  mapInstance.setMaxBounds(limitesAndar);

  // Injeta a imagem INTRANET_CIRON.png como fundo do andar atual
  imagemFundoAtual = L.imageOverlay("/mapas_interno.svg", limitesAndar).addTo(
    mapInstance,
  );
  mapInstance.fitBounds(limitesAndar);

  andarAlvo.rooms.forEach((room) => {
    // 🔥 CORRIGIDO: Polígono interno com coordenadas limpas e válidas para a escala da planta (1200x800)
    const roomVertices: L.LatLngTuple[] = room.outline;

    const roomPolygon = L.polygon(roomVertices, {
      ...room.config,
      bubblingMouseEvents: false,
    }).addTo(geometricLayerGroup);

    roomPolygon
      .bindTooltip(room.name, {
        permanent: true,
        direction: "center",
        className: "polygon-label",
      })
      .openTooltip();

    roomPolygon.bindPopup(`<b>${room.description}</b>`);
  });
};

const changeFloor = (floorNumber: number): void => {
  transitionToMicro(selectedBuilding.value, floorNumber);
};

onMounted(async () => {
  await mapStore.loadModules();
  void nextTick(() => {
    inicializarMapa();
  });
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
});

onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
});
</script>

<style lang="scss" scoped>
:deep(.regular-room) {
  transition:
    fill 0.2s ease,
    fill-opacity 0.2s ease,
    stroke 0.2s ease;
  color: "#10b981";
  fill: "#34d399";
  fill-opacity: 0.5;
  stroke-width: 4px;

  &:hover {
    fill: #2563eb !important; // Altera a cor de fundo interna do SVG
    fill-opacity: 0.75 !important; // Aumenta o destaque do preenchimento
    stroke: #00258b !important; // Altera a borda
  }
}

:deep(.meeting-room) {
  transition:
    fill 0.2s ease,
    fill-opacity 0.2s ease,
    stroke 0.2s ease;
  color: #048300;
  fill: #048300;
  fill-opacity: 0.5;
  stroke-width: 4px;

  &:hover {
    fill: #06ac00 !important; // Altera a cor de fundo interna do SVG
    fill-opacity: 0.75 !important; // Aumenta o destaque do preenchimento
    stroke: #06ac00 !important; // Altera a borda
  }
}

:deep(.polygon-label) {
  background: transparent;
  border: none;
  box-shadow: none;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.75rem;
  font-weight: bold;
  color: rgb(228, 228, 228);
  text-shadow:
    -1px -1px 0 #333,
    1px -1px 0 #333,
    -1px 1px 0 #333,
    1px 1px 0 #333;
}

.precision-cursor {
  cursor: crosshair !important;

  :deep(.leaflet-interactive) {
    cursor: crosshair !important;
  }
}

/* Hide the small tooltip arrow */
:deep(.polygon-label::before) {
  display: none;
}

.map-wrapper {
  height: 900px;
  width: 1000px;
}

.map-canvas {
  width: 100%;
  height: 100%;
  background-color: #2e2e2e;
  min-height: 300px;
  cursor: grab;
}

.custom-controls {
  z-index: 1000;
  min-width: 210px;
}

.bg-blur {
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

:deep(.leaflet-grab) {
  cursor: grab !important;
}

:deep(.leaflet-dragging .leaflet-grab) {
  cursor: grabbing !important;
}
</style>
