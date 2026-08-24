import { defineStore } from "pinia";

function getPreviousMonth(monthName: string): string {
  const currentMonthIndex = monthsAux.findIndex(
    (month) => month.label === monthName,
  );
  const newMonthIndex =
    (currentMonthIndex - 1 + monthsAux.length) % monthsAux.length;

  return monthsAux[newMonthIndex].label;
}
function getNextMonth(monthName: string): string {
  const currentMonthIndex = monthsAux.findIndex(
    (month) => month.label === monthName,
  );
  const newMonthIndex = (currentMonthIndex + 1) % monthsAux.length;

  return monthsAux[newMonthIndex].label;
}

const id = "maps";
export interface EntityConfig {
  color: string;
  weight: number;
  dashArray: string;
  fillColor: string;
  fillOpacity: number;
  interactive: boolean;
  className: string;
}
export interface Room {
  name: string;
  description: string;
  outline: Array<Array<number>>;
  config: EntityConfig;
}
export interface Floor {
  value: number;
  label: string;
  width: number;
  height: number;
  rooms: Array<Room>;
}
export interface Building {
  name: string;
  id: string;
  initialFloor: number;
  outline: Array<Array<number>>;
  config: EntityConfig;
  floors: Array<Floor>;
}

export const useMaps = defineStore(id, {
  state: (): State => ({
    modules: [],
  }),
  getters: {},
  actions: {
    loadEvents: async (months: AuxMonth[], year: number) => {},
  },
});
