import { ICreep, IRoleConfig } from '../types';
import { countCreepsByRole, moveToOptions } from '../utils';

const run = (creep: ICreep) => {
   if (
      creep.upgradeController(creep.room.controller as StructureController) ===
      ERR_NOT_IN_RANGE
   ) {
      creep.moveTo(
         creep.room.controller as StructureController,
         moveToOptions('#ff0000')
      );
   }
};

export const ROLE_UPGRADE: IRoleConfig = {
   name: 'upgrade',
   run,
   shouldRun: ({ creep, creeps }) =>
      countCreepsByRole(creeps, 'upgrade') < creeps.length / 4 &&
      creep.carry.energy > 0,
   shouldStop: ({ creep }) => creep.carry.energy === 0,
};
