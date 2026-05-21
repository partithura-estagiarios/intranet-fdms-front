import { defineStore } from "pinia";
import { pagesOfTable } from "../components/TableRamais/lib";
import RamaisForPageLoad from "../graphql/ramais/RamaisForPageLoad.gql";
import GetLenghtRamais from "../graphql/ramais/GetLenghtRamais.gql";
import SearchRamal from "../graphql/ramais/SearchRamal.gql";
import { Ramal } from "../entities/ramal";
const id = "ramais";
interface State {
  ramais: Ramal[];
  pagination: number;
  word: string;
  pages: number;
}
export const useRamais = defineStore(id, {
  state: (): State => ({
    ramais: [],
    pagination: 0,
    word: "",
    pages: 0,
  }),
  getters: {
    getAllRamais: (state) => {
      return state.ramais;
    },
    getPages: (state) => {
      return state.pages;
    },
    getPagination: (state) => {
      return state.pagination;
    },
  },
  actions: {
    loadRamais: async (page: number) => {
      const ramaisStorage = useRamais();
      ramaisStorage.pagination = page;
      await ramaisStorage.searchRamal(ramaisStorage.word);
      const { ramaisForPageLoad }: { ramaisForPageLoad: Array<Ramal> } =
        await runQuery(RamaisForPageLoad, {
          page: page,
        });

      ramaisStorage.ramais = ramaisForPageLoad;
    },
    searchRamal: async (word: string) => {
      const ramaisStorage = useRamais();
      ramaisStorage.word = word ?? "";
      const { searchRamal }: { searchRamal: Ramal[] } = await runQuery(
        SearchRamal,
        {
          word: word,
        },
      );
      ramaisStorage.ramais = searchRamal;
      await ramaisStorage.loadSizeRamais(word);
    },
    loadSizeRamais: async (word: string) => {
      const ramaisStorage = useRamais();
      const { getLenghtRamais }: { getLenghtRamais: number } = await runQuery(
        GetLenghtRamais,
        {
          maxPages: pagesOfTable,
          word: word,
        },
      );
      ramaisStorage.pages = getLenghtRamais;
    },

    refreshCurrent: async () => {
      const ramaisStorage = useRamais();
      const hasSearch = !!ramaisStorage.word?.trim();

      if (hasSearch) {
        await ramaisStorage.searchRamal(ramaisStorage.word);
        return;
      }

      await ramaisStorage.loadRamais(ramaisStorage.pagination || 0);
    },
  },
});
