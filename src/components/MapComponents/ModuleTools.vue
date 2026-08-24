<!-- src/components/ModuleTools.vue -->
<template>
  <div
    class="col-3 bg-white q-pa-md shadow-1 column justify-between"
    style="max-width: 280px"
  >
    <div>
      <!-- Máquina de Etapas -->
      <div class="text-caption text-bold text-grey-6 uppercase q-mb-xs">
        Fluxo de Engenharia
      </div>
      <q-stepper
        v-model="currentStep"
        vertical
        color="primary"
        flat
        class="bg-transparent q-pa-none"
      >
        <q-step
          name="BASE_PISO"
          title="Piso Estrutural"
          icon="architecture"
          :done="currentStep === 'SALAS'"
        >
          <div class="text-caption text-grey-7 q-mb-sm">
            Desenhe o perímetro externo da fábrica.
          </div>
          <q-btn
            color="secondary"
            size="xs"
            label="Replicar p/ andares"
            class="full-width q-mb-xs"
            @click="$emit('replicar-base')"
          />
          <q-btn
            color="primary"
            size="sm"
            label="Avançar p/ Salas"
            class="full-width"
            @click="currentStep = 'SALAS'"
          />
        </q-step>

        <q-step name="SALAS" title="Divisórias Internas" icon="meeting_room">
          <div class="text-caption text-grey-7 q-mb-sm">
            Desenhe e agrupe polígonos para criar as salas do andar.
          </div>
          <q-btn
            color="dark"
            size="xs"
            label="Voltar Contorno"
            class="full-width"
            @click="currentStep = 'BASE_PISO'"
          />
        </q-step>
      </q-stepper>

      <q-separator class="q-my-md" />

      <!-- Painel das Ferramentas CAD -->
      <div class="text-caption text-bold text-grey-6 uppercase q-mb-sm">
        Ferramentas de Desenho
      </div>
      <div class="column q-gap-sm">
        <q-btn-toggle
          v-model="activeTool"
          toggle-color="primary"
          flat
          bordered
          spread
          class="full-width"
          :options="[
            { icon: 'open_with', value: 'SELECT' },
            { icon: 'layers', value: 'RECTANGLE' },
            { icon: 'blur_circular', value: 'ARC' },
          ]"
        />

        <q-btn
          outline
          color="primary"
          icon="straighten"
          label="Adicionar Retângulo"
          class="full-width q-mt-xs"
          @click="$emit('abrir-modal-retangulo')"
        />
      </div>

      <q-separator class="q-my-md" />

      <!-- Operações Booleanas -->
      <div class="text-caption text-bold text-grey-6 uppercase q-mb-sm">
        Operações Vetoriais
      </div>
      <div class="row q-col-gutter-xs">
        <div class="col-6">
          <q-btn
            icon="join_full"
            label="Unir"
            color="grey-9"
            class="full-width"
            dense
            size="sm"
          />
        </div>
        <div class="col-6">
          <q-btn
            icon="difference"
            label="Subtrair"
            color="grey-9"
            class="full-width"
            dense
            size="sm"
          />
        </div>
      </div>
    </div>

    <!-- Seletor de Andar em Edição -->
    <div class="q-mt-md">
      <q-separator class="q-my-sm" />
      <div class="text-caption text-bold text-grey-6 uppercase q-mb-xs">
        Andar em Foco
      </div>
      <q-input
        v-model.number="andarAtivoEdicao"
        type="number"
        outlined
        dense
        label="Nível do Piso"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  activeTool,
  currentStep,
  andarAtivoEdicao,
} from "../../composables/useModuleEditor";
defineEmits(["abrir-modal-retangulo", "replicar-base"]);
</script>
