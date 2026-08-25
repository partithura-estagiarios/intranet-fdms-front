import { defineStore } from "pinia";

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
  id: string;
  name: string;
  description: string;
  outline: Array<Array<number>>;
  config: EntityConfig;
  isActive: boolean;
}
export interface Floor {
  value: number;
  label: string;
  width: number;
  height: number;
  isActive: boolean;
  rooms: Array<Room>;
}
export interface Building {
  name: string;
  id: string;
  isActive: boolean;
  initialFloor: number;
  outline: Array<Array<number>>;
  config: EntityConfig;
  floors: Array<Floor>;
}

const defaultBuildingConfig: EntityConfig = {
  color: "#3388ff",
  weight: 3,
  dashArray: "",
  fillColor: "#3388ff",
  fillOpacity: 0.2,
  interactive: true,
  className: "regular-building",
};

const defaultRoomConfig: EntityConfig = {
  color: "#10b981",
  weight: 2,
  dashArray: "5, 5",
  fillColor: "#10b981",
  fillOpacity: 0.4,
  interactive: true,
  className: "regular-room",
};
interface State {
  buildings: Array<Building>;
}

export const useMaps = defineStore(id, {
  state: (): State => ({
    buildings: [],
  }),
  getters: {},
  actions: {
    async loadModules() {
      // Simula o atraso de uma requisição de API
      await new Promise((resolve) => setTimeout(resolve, 500));

      /* mockup: */
      this.buildings = [
        {
          id: "build0",
          isActive: true,
          name: "Sede Principal",
          initialFloor: 0,
          outline: [
            [15300, 20400],
            [18980, 20400],
            [18980, 20920],
            [15300, 20920],
          ],
          config: defaultBuildingConfig,
          floors: [
            {
              value: 0,
              label: "Térreo",
              isActive: true,
              width: 44000,
              height: 44000,
              rooms: [
                {
                  id: "recepcao",
                  name: "Recepção",
                  description: "Área de entrada principal",
                  isActive: true,
                  outline: [
                    [18000, 8500],
                    [18000, 14000],
                    [21000, 14000],
                    [21000, 8500],
                  ],
                  config: defaultRoomConfig,
                },
                {
                  id: "salaA",
                  name: "Sala de Reuniões A",
                  description: "Sala grande com projetor",
                  isActive: true,
                  outline: [
                    [16500, 8500],
                    [16500, 12000],
                    [18000, 12000],
                    [18000, 8500],
                  ],
                  config: { ...defaultRoomConfig, fillColor: "#ef4444" }, // Cor customizada
                },
              ],
            },
            {
              value: 1,
              label: "1º Andar",
              isActive: true,
              width: 44000,
              height: 44000,
              rooms: [
                {
                  id: "laboratorio",
                  name: "Laboratório de TI",
                  description: "Desenvolvimento e infraestrutura",
                  isActive: true,
                  outline: [
                    [16500, 8500],
                    [16500, 12000],
                    [18000, 12000],
                    [18000, 8500],
                  ],
                  config: defaultRoomConfig,
                },
              ],
            },
          ],
        },
        {
          id: "build1",
          isActive: true,
          name: "Usinagem",
          initialFloor: 0,
          outline: [
            [19300, 20400],
            [23700, 20400],
            [23700, 24400],
            [19300, 24400],
          ],
          config: defaultBuildingConfig,
          floors: [
            {
              value: 0,
              isActive: true,
              label: "Térreo",
              width: 44000,
              height: 44000,
              rooms: [],
            },
            {
              value: 1,
              isActive: true,
              label: "1º Andar",
              width: 44000,
              height: 44000,
              rooms: [],
            },
          ],
        },
        {
          id: "fabrica2",
          isActive: true,
          name: "Fábrica 2",
          initialFloor: 0,
          outline: [
            [17260, 25160],
            [25900, 25160],
            [25900, 27760],
            [17260, 27760],
          ],
          config: defaultBuildingConfig,
          floors: [],
        },
        {
          id: "pintura2",
          isActive: true,
          name: "Pintura Líquida",
          initialFloor: 0,
          outline: [
            [24900, 22440],
            [26660, 22440],
            [26660, 23920],
            [24900, 23920],
          ],
          config: defaultBuildingConfig,
          floors: [],
        },
        {
          id: "pintura1",
          isActive: true,
          name: "Pintura E-Coat",
          initialFloor: 0,
          outline: [
            [30200, 19400],
            [26560, 19640],
            [26440, 18212],
            [30080, 17972],
          ],
          config: defaultBuildingConfig,
          floors: [],
        },
        {
          id: "build2",
          isActive: true,
          name: "Fábrica 1",
          initialFloor: 0,
          outline: [
            [24520, 18680],
            [21560, 18680],
            [21560, 19760],
            [20400, 19760],
            [20400, 18680],
            [17220, 18680],
            [17220, 16080],
            [24520, 16080],
          ],
          config: defaultBuildingConfig,
          floors: [],
        },
        {
          id: "build9",
          isActive: true,
          name: "Auditório",
          initialFloor: 0,
          outline: [
            [20400, 19760],
            [18800, 19760],
            [18800, 19440],
            [20400, 19440],
          ],
          config: defaultBuildingConfig,
          floors: [],
        },
        {
          id: "build3",
          isActive: true,
          name: "Refeitório",
          initialFloor: 0,
          outline: [
            [17220, 16080],
            [17220, 16920],
            [16020, 16920],
            [16020, 16080],
          ],
          config: defaultBuildingConfig,
          floors: [],
        },
        {
          id: "build4",
          isActive: true,
          name: "SESMT",
          initialFloor: 0,
          outline: [
            [15200, 19520],
            [15200, 20000],
            [15520, 20000],
            [15520, 19520],
          ],
          config: defaultBuildingConfig,
          floors: [],
        },
        // {
        //   id: "estacionamento1",
        //    isActive: true,
        //   name: "Estacionamento carros",
        //   initialFloor: 0,
        //   outline: [
        //     [18000, 21000],
        //     [18000, 24400],
        //     [16600, 24400],
        //     [16600, 23000],
        //     [15300, 23000],
        //     [15300, 21000],
        //   ],
        //   config: defaultBuildingConfig,
        //   floors: [],
        // },
      ];
    },
    toggleStructure(
      isActive: boolean,
      buildId: string,
      floorValue?: number,
      roomId?: string,
    ) {
      if (buildId) {
        const buildIndex = this.buildings.findIndex((build) => {
          return build.id === buildId;
        });
        if (buildIndex >= 0) {
          if (floorValue == null || floorValue == undefined) {
            this.buildings[buildIndex].isActive = isActive;
            return;
          }
          const floorIndex = this.buildings[buildIndex].floors.findIndex(
            (floor) => {
              return floor.value === floorValue;
            },
          );
          if (floorIndex >= 0) {
            if (!roomId) {
              this.buildings[buildIndex].floors[floorIndex].isActive = isActive;
              return;
            }
            const roomIndex = this.buildings[buildIndex].floors[
              floorIndex
            ].rooms.findIndex((room) => {
              return room.id === roomId;
            });
            if (floorIndex >= 0) {
              this.buildings[buildIndex].floors[floorIndex].rooms[
                roomIndex
              ].isActive = isActive;
            }
            return;
          }
          return;
        }
        return;
      }
      return;
    },
  },
});
