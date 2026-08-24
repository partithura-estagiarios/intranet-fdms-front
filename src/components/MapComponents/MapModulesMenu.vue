<template>
  <div class="column q-gap-md px-5 full-height bg-white border-left shadow-1">
    <div class="text-h6 text-bold text-primary">Gerenciador do Pátio</div>

    <!-- Botões de Ação Principal -->
    <q-btn
      color="primary"
      icon="settings"
      label="CRUD de Módulos (CAD)"
      class="full-width"
      @click="$emit('abrir-cad', null)"
    />

    <q-btn
      color="secondary"
      icon="add_box"
      label="Adicionar Novo ao Pátio"
      class="full-width q-mt-sm"
      :disable="!moduloSelecionadoParaInsercao"
      @click="emitirAdicionarAoPatio"
    />

    <q-separator class="q-my-md" />

    <!-- Lista de Módulos Instalados no Pátio -->
    <div class="text-subtitle2 text-grey-7 q-mb-xs">
      Instalados no Mapa Atual
    </div>
    <q-scroll-area class="col">
      <q-list bordered separator v-if="modulosNoMapa.length > 0">
        <q-item v-for="item in modulosNoMapa" :key="item.instanciaId">
          <q-item-section>
            <q-item-label class="text-bold">{{ item.nome }}</q-item-label>
            <q-item-label caption
              >Pos: X:{{ item.x }}m, Y:{{ item.y }}m</q-item-label
            >
          </q-item-section>

          <q-item-section side>
            <div class="row q-gutter-xs">
              <q-btn
                size="sm"
                flat
                round
                color="primary"
                icon="edit_location"
                @click="emitirEditarPosicao(item.instanciaId)"
              />
              <q-btn
                size="sm"
                flat
                round
                color="negative"
                icon="delete"
                @click="emitirRemoverDoPatio(item.instanciaId)"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <div v-else class="text-center text-caption text-grey-5 q-pa-lg">
        Nenhum módulo posicionado no pátio ainda.
      </div>
    </q-scroll-area>

    <!-- Modal CRUD (Manager) encapsulado -->
    <map-modules-manager
      v-model="showCrudModal"
      @selecionar-modulo="definirModuloParaInsercao"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MapModulesManager from "./MapModulesManager.vue";

interface ModuloInstanciado {
  instanciaId: string;
  nome: string;
  x: number;
  y: number;
  rot: number;
}

const showCrudModal = ref(false);
const moduloSelecionadoParaInsercao = ref<string | null>(null);

// Mocks de controle do pátio geral
const modulosNoMapa = ref<ModuloInstanciado[]>([
  { instanciaId: "1", nome: "Fábrica 1 - Fundição", x: 45, y: 120, rot: 0 },
  { instanciaId: "2", nome: "Prédio Administrativo", x: 110, y: 35, rot: 0 },
]);

const emit = defineEmits([
  "adicionar-ao-patio",
  "editar-posicao",
  "remover-do-patio",
]);

const definirModuloParaInsercao = (moduloId: string) => {
  moduloSelecionadoParaInsercao.value = moduloId;
};

const emitirAdicionarAoPatio = () => {
  emit("adicionar-ao-patio", moduloSelecionadoParaInsercao.value);
};

const emitirEditarPosicao = (id: string) => {
  emit("editar-posicao", id);
};

const emitirRemoverDoPatio = (id: string) => {
  emit("remover-do-patio", id);
  modulosNoMapa.value = modulosNoMapa.value.filter((m) => m.instanciaId !== id);
};
</script>
