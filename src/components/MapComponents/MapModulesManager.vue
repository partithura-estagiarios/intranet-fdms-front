<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:model-value', val)"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="column bg-grey-1">
      <q-bar class="bg-primary text-white">
        <q-icon name="business" />
        <div>Repositório de Módulos Industriais (CAD)</div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>

      <q-card-section class="row q-col-gutter-md col q-pa-lg">
        <!-- Lista de Modelos Criados -->
        <div class="col-8 column">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6 text-bold text-grey-8">Módulos Cadastrados</div>
            <q-btn
              color="positive"
              icon="add"
              label="Novo Módulo Paramétrico"
              @click="abrirCriacaoNovoModulo"
            />
          </div>

          <q-table
            :rows="listaModulos"
            :columns="colunasTabela"
            row-key="id"
            flat
            bordered
            class="col shadow-1 bg-white"
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-xs">
                <q-btn
                  size="sm"
                  color="primary"
                  label="Usar"
                  dense
                  class="q-px-sm"
                  @click="selecionarParaOPatio(props.row.id)"
                  v-close-popup
                />
                <q-btn
                  size="sm"
                  color="warning"
                  icon="edit"
                  round
                  dense
                  @click="abrirEditorCadviaId(props.row)"
                />
                <q-btn
                  size="sm"
                  color="negative"
                  icon="delete"
                  round
                  dense
                  @click="deletarModuloModelo(props.row.id)"
                />
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- Painel Lateral Informativo -->
        <div class="col-4">
          <q-card flat bordered class="full-height q-pa-md bg-white">
            <div class="text-subtitle1 text-bold text-primary q-mb-sm">
              Instruções de Escala
            </div>
            <p class="text-caption text-grey-7">
              Os módulos salvos nesta tela utilizam **metros puros**. Eles
              representam a geometria exata da arquitetura interna da Fundimisa.
              Uma vez desenhado o contorno e as salas, você poderá instanciá-los
              múltiplas vezes em qualquer quadrante do pátio geral da empresa.
            </p>
          </q-card>
        </div>
      </q-card-section>
    </q-card>

    <!-- Invocação do Editor CAD em Tela Cheia -->
    <q-dialog v-model="showEditorCad" maximized>
      <module-editor
        @save="salvarModuloNoRepositorio"
        @close="showEditorCad = false"
      />
    </q-dialog>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  moduloEmEdicao,
  type ModuloCorporativo,
} from "../../composables/useModuleEditor";
import ModuleEditor from "./ModuleEditor.vue";

defineProps<{ modelValue: boolean }>();
const emit = defineEmits(["update:model-value", "selecionar-modulo"]);

const showEditorCad = ref(false);

const listaModulos = ref<ModuloCorporativo[]>([
  {
    id: "mod-1",
    nome: "Módulo Padrão Usinagem",
    quantidadePisos: 2,
    salasPorAndar: {},
  },
  {
    id: "mod-2",
    nome: "Almoxarifado Geral",
    quantidadePisos: 1,
    salasPorAndar: {},
  },
]);

const colunasTabela = [
  {
    name: "nome",
    label: "Nome do Módulo",
    field: "nome",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "pisos",
    label: "Nº Andares",
    field: "quantidadePisos",
    align: "center" as const,
  },
  {
    name: "actions",
    label: "Ações Disponíveis",
    field: "actions",
    align: "right" as const,
  },
];

const abrirCriacaoNovoModulo = () => {
  moduloEmEdicao.value = {
    id: crypto.randomUUID(),
    nome: "Novo Prédio Industrial",
    quantidadePisos: 1,
    salasPorAndar: {},
  };
  showEditorCad.value = true;
};

const abrirEditorCadviaId = (modulo: ModuloCorporativo) => {
  moduloEmEdicao.value = { ...modulo };
  showEditorCad.value = true;
};

const deletarModuloModelo = (id: string) => {
  listaModulos.value = listaModulos.value.filter((m) => m.id !== id);
};

const selecionarParaOPatio = (id: string) => {
  emit("selecionar-modulo", id);
};

const salvarModuloNoRepositorio = (moduloSalvo: ModuloCorporativo) => {
  const index = listaModulos.value.findIndex((m) => m.id === moduloSalvo.id);
  if (index !== -1) {
    listaModulos.value[index] = moduloSalvo;
  } else {
    listaModulos.value.push(moduloSalvo);
  }
  showEditorCad.value = false;
};
</script>
