<template>
  <!-- Quasar Wrapper: Forçamos uma altura fixa ou dinamicamente amarrada ao layout -->
  <div class="map-wrapper relative-position overflow-hidden full-width">
    <!-- Container onde o Leaflet injetará o Canvas do mapa -->
    <div id="patio-map-container" class="map-canvas"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, onBeforeUnmount } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ConfigMapa {
  urlImagemAerea: string;
  larguraPixel: number;
  alturaPixel: number;
}

const mapInstance = ref<L.Map | null>(null);

const CONFIG_MAPA: ConfigMapa = {
  urlImagemAerea: "/mapa.png", // public/mapa.png
  larguraPixel: 2578, // Altere para a largura real do seu arquivo png
  alturaPixel: 1897, // Altere para a altura real do seu arquivo png
};

const inicializarMapa = (): void => {
  const limitesImagem: L.LatLngBoundsExpression = [
    [0, 0],
    [CONFIG_MAPA.alturaPixel, CONFIG_MAPA.larguraPixel],
  ];

  mapInstance.value = L.map("patio-map-container", {
    crs: L.CRS.Simple,
    minZoom: -1,
    maxZoom: 2,
    maxBounds: limitesImagem,
    maxBoundsViscosity: 1.0,
    attributionControl: false,
  });
  // 1. Renderiza a Imagem de Fundo
  L.imageOverlay(CONFIG_MAPA.urlImagemAerea, limitesImagem).addTo(
    mapInstance.value,
  );
  mapInstance.value.fitBounds(limitesImagem);

  const verticesDaFabrica: L.LatLngTuple[] = [
    [1338, 717], // Ponto 1: [Y, X] Canto Inferior Esquerdo
    [1274, 973], // Ponto 2: [Y, X] Canto Superior Esquerdo
    [600, 788], // Ponto 3: [Y, X] Canto Superior Direito
    [669, 545], // Ponto 4: [Y, X] Canto Inferior Direito
  ];

  // 2. Criamos o Polígono nativo do Leaflet e aplicamos a estilização via código
  const poligonoFabrica = L.polygon(verticesDaFabrica, {
    color: "#1d4ed8", // Cor da borda (Equivalente ao stroke do SVG)
    weight: 3, // Espessura da borda
    dashArray: "5, 5", // Borda tracejada
    fillColor: "#3b82f6", // Cor do preenchimento (Equivalente ao fill do SVG)
    fillOpacity: 0.5, // Opacidade do fundo
    interactive: true, // Permite cliques e interação
  }).addTo(mapInstance.value);

  // 3. Vincula o popup nativo ao polígono
  poligonoFabrica.bindPopup(
    '<b style="font-size: 14px;">Fábrica 1 Detectada</b><br>Geometria nativa carregada com sucesso.',
  );

  // =========================================================================
  // 🕵️‍♂️ CAPTURADOR DE CLIQUES (MANTIDO PARA CALIBRAÇÃO)
  // =========================================================================
  mapInstance.value.on("click", (e: L.LeafletMouseEvent) => {
    const cliqueY = Math.round(e.latlng.lat);
    const cliqueX = Math.round(e.latlng.lng);

    console.log(`[${cliqueY}, ${cliqueX}]`);
  });

  // =========================================================================

  setTimeout(() => {
    if (mapInstance.value) {
      mapInstance.value.invalidateSize();
    }
  }, 100);
};

onMounted(() => {
  void nextTick(() => {
    inicializarMapa();
  });
});

onBeforeUnmount(() => {
  if (mapInstance.value) {
    mapInstance.value.remove();
    mapInstance.value = null;
  }
});
</script>

<style lang="scss" scoped>
.map-wrapper {
  // Se estiver testando em uma página solta, use 100vh.
  // Se for usar dentro do q-dialog (modal), altere para px fixos (ex: 500px) para testar.
  height: 1000px;
  width: 1000px;
}

.map-canvas {
  width: 100%;
  height: 100%;
  background-color: #2b2b2b;
  /* Fundo cinza visível para você ter certeza que a div abriu */
  min-height: 300px;
  /* Impede que o container colapse para 0px em qualquer situação */
}

:deep(.leaflet-grab) {
  cursor: grab !important;
}

:deep(.leaflet-dragging .leaflet-grab) {
  cursor: grabbing !important;
}
</style>
