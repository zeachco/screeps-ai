import { ICreep, IRoleConfig } from '../types';
import { countCreepsByRole, SHOULD_HAVE_ENERGY } from '../utils';

const run = (creep: ICreep) => {
   if (
      creep.upgradeController(creep.room.controller as StructureController) ===
      ERR_NOT_IN_RANGE
   ) {
      creep.moveTo(creep.room.controller as StructureController, {
         visualizePathStyle: { stroke: '#8888ff' },
      });
   }
};

export const ROLE_UPGRADE: IRoleConfig = {
   name: 'upgrade',
   run,
   roomRequirements: (_, cs) => countCreepsByRole(cs, 'upgrade') <= 1,
   ...SHOULD_HAVE_ENERGY,
};
