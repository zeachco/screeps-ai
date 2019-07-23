const WORK_T1 = [WORK, CARRY, MOVE];
const WORK_T2 = [WORK, WORK, CARRY, MOVE, MOVE];
const WORK_T3 = [WORK, WORK, WORK, CARRY, MOVE, MOVE];

export const creepPresets = {
   harvester: {
      nb: 4,
      body: WORK_T1,
   },
   upgrader: {
      nb: 4,
      body: WORK_T3,
   },
   builder: {
      nb: 3,
      body: WORK_T2,
   },
};

export type TRole = keyof (typeof creepPresets);

export interface ICreep extends Creep {
   memory: {
      role: TRole;
      building: boolean;
      upgrading: boolean;
   };
}
