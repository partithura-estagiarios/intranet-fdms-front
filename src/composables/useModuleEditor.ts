import { ref } from "vue";
import paper from "paper";

export type ToolType =
  | "SELECT"
  | "RECTANGLE"
  | "ARC"
  | "POLYGON_FREE"
  | "DELETE";
export type EditorStep = "BASE_PISO" | "SALAS";

export interface Auditoria {
  data: string;
  status: "PENDENTE" | "REALIZADA" | "ATRASADA";
}

export interface MetadadosSala {
  id: string;
  nome: string;
  descricao: string;
  mapaRiscosUrl?: string;
  aspectosAmbientais?: string;
  planoContingencia?: string;
  cronogramaAuditorias: Auditoria[];
  funcionariosIds: number[];
}

export interface ModuloCorporativo {
  id: string;
  nome: string;
  quantidadePisos: number;
  svgContornoBase?: string; // String SVG gerada na Etapa 1
  salasPorAndar: Record<number, MetadadosSala[]>; // Indexado por número do andar
}

// Instâncias Globais do Editor (Livres de Proxies do Vue para não quebrar o Paper.js)
export const activeTool = ref<ToolType>("SELECT");
export const currentStep = ref<EditorStep>("BASE_PISO");
export const tamanhoSnapMetros = ref<number>(1.0);
export const moduloEmEdicao = ref<ModuloCorporativo | null>(null);
export const andarAtivoEdicao = ref<number>(0);

// Fator de conversão: 1 metro real = 40 pixels no Canvas
export const METRO_EM_PIXELS = 40;

/**
 * Aplica a operação booleana de UNIÃO nas formas selecionadas no Canvas
 */
export function aplicarUniao(items: paper.PathItem[]): paper.PathItem | null {
  if (items.length < 2) return null;
  let resultado = items[0];
  for (let i = 1; i < items.length; i++) {
    const fusa = resultado.unite(items[i]);
    resultado.remove();
    items[i].remove();
    resultado = fusa;
  }
  resultado.selected = true;
  paper.view.update();
  return resultado;
}

/**
 * Aplica a operação booleana de SUBTRAÇÃO nas formas selecionadas
 */
export function aplicarSubtracao(
  base: paper.PathItem,
  faca: paper.PathItem,
): paper.PathItem {
  const resultado = base.subtract(faca);
  base.remove();
  faca.remove();
  paper.view.update();
  return resultado;
}
