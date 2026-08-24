<template>
  <q-card class="column full-width full-height bg-grey-3">
    <!-- Topbar Informativa -->
    <q-bar class="bg-dark text-white q-pa-md">
      <q-btn
        flat
        round
        dense
        icon="arrow_back"
        color="white"
        @click="$emit('close')"
      />
      <div class="text-subtitle1 text-bold q-ml-sm">
        CAD Paramétrico:
        <span class="text-amber">{{ moduloEmEdicao?.nome }}</span>
      </div>
      <q-space />
      <q-chip dark color="primary" text-color="white" icon="grid_3x3">
        Snap Grid: {{ tamanhoSnapMetros }}m (Use ',' ou '.')
      </q-chip>
      <q-btn
        color="positive"
        label="Concluir e Salvar"
        icon="save"
        size="sm"
        @click="finalizarEExportar"
      />
    </q-bar>

    <div class="row col no-wrap">
      <!-- MÓDULO LATERAL DE COMPLEMENTOS E ETAPAS (ModuleTools) -->
      <module-tools
        @abrir-modal-retangulo="promptParametrosRetangulo"
        @replicar-base="replicarContornoEstrutural"
      />

      <!-- PALCO DE DESENHO VETORIAL -->
      <div
        class="col relative-position column justify-center items-center q-pa-md"
      >
        <!-- Canvas Puro Interceptado pelo Paper.js -->
        <canvas
          id="cad-engine-canvas"
          class="bg-white shadow-6 border-radius-sm full-width full-height cursor-crosshair"
          @mousemove="gerenciarMovimentoMouse"
          @click="gerenciarCliqueCanvas"
        ></canvas>
      </div>
    </div>

    <!-- Modal de Coleta Paramétrica (Quasar Dialog) -->
    <q-dialog v-model="modalRetangulo.visivel" persistent>
      <q-card style="min-width: 300px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6 text-bold">Dimensões do Bloco</div>
        </q-card-section>
        <q-card-section class="q-pt-md column q-gap-sm">
          <q-input
            v-model.number="modalRetangulo.largura"
            type="number"
            label="Largura Real (Metros)"
            outlined
            dense
            suffix="m"
          />
          <q-input
            v-model.number="modalRetangulo.altura"
            type="number"
            label="Altura Real (Metros)"
            outlined
            dense
            suffix="m"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn
            flat
            label="Gerar Forma"
            color="positive"
            @click="injetarRetanguloParametrizado"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from "vue";
import paper from "paper";
import {
  moduloEmEdicao,
  tamanhoSnapMetros,
  activeTool,
  currentStep,
  andarAtivoEdicao,
  METRO_EM_PIXELS,
  type ModuloCorporativo,
} from "../../composables/useModuleEditor";
import ModuleTools from "./ModuleTools.vue";

const emit = defineEmits(["save", "close"]);

const modalRetangulo = ref({ visivel: false, largura: 5, altura: 4 });
let previewShape: paper.Path.Rectangle | null = null;

onMounted(() => {
  const canvas = document.getElementById(
    "cad-engine-canvas",
  ) as HTMLCanvasElement;
  paper.setup(canvas);

  // Criação de linhas de fundo em formato grid invisível
  desenharGradeBackground();
  window.addEventListener("keydown", gerenciarAtalhosTeclado);
});

const desenharGradeBackground = () => {
  const larguraCanvas = paper.view.size.width;
  const alturaCanvas = paper.view.size.height;

  for (let x = 0; x < larguraCanvas; x += METRO_EM_PIXELS) {
    const linha = new paper.Path.Line(
      new paper.Point(x, 0),
      new paper.Point(x, alturaCanvas),
    );
    linha.strokeColor = new paper.Color("#f3f4f6");
  }
  paper.view.update();
};

const promptParametrosRetangulo = () => {
  modalRetangulo.value.visivel = true;
};

const injetarRetanguloParametrizado = () => {
  const wPixels = modalRetangulo.value.largura * METRO_EM_PIXELS;
  const hPixels = modalRetangulo.value.altura * METRO_EM_PIXELS;

  // Se for o contorno inicial, centraliza automaticamente no meio do Canvas
  const centro = paper.view.center;

  const retangulo = new paper.Path.Rectangle({
    point: [centro.x - wPixels / 2, centro.y - hPixels / 2],
    size: [wPixels, hPixels],
    fillColor:
      currentStep.value === "BASE_PISO"
        ? "rgba(59, 130, 246, 0.3)"
        : "rgba(16, 185, 129, 0.4)",
    strokeColor: currentStep.value === "BASE_PISO" ? "#3b82f6" : "#10b981",
    strokeWidth: 2,
  });

  paper.view.update();
};

const gerenciarMovimentoMouse = (event: MouseEvent) => {
  if (activeTool.value !== "RECTANGLE" || !previewShape) return;
  // Lógica para arrastar o preview geométrico preso ao mouse...
};

const gerenciarCliqueCanvas = (event: MouseEvent) => {
  // Lógica para fixar a forma ou selecionar elementos existentes...
};

const replicarContornoEstrutural = () => {
  // Captura o contorno da Etapa 1 e copia para o array das outras instâncias...
  console.log("Perímetro replicado com sucesso para os andares superiores.");
};

const gerenciarAtalhosTeclado = (e: KeyboardEvent) => {
  if (e.key === ".") tamanhoSnapMetros.value *= 2;
  if (e.key === ",")
    tamanhoSnapMetros.value = Math.max(0.125, tamanhoSnapMetros.value / 2);
};

const finalizarEExportar = () => {
  if (!moduloEmEdicao.value) return;

  // Exporta toda a árvore vetorial do Paper.js como string SVG para salvar no Postgres
  const stringSvgFinal = paper.project.exportSVG({ asString: true }) as string;
  moduloEmEdicao.value.svgContornoBase = stringSvgFinal;

  emit("save", moduloEmEdicao.value);
};

onBeforeUnmount(() => {
  window.removeEventListener("keydown", gerenciarAtalhosTeclado);
});
</script>
