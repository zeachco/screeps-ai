import { ICreep, IRoleConfig } from '../types';
import { countCreepsByRole, SHOULD_HAVE_ENERGY, moveToOptions } from '../utils';

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
   roomRequirements: ({ room }, cs) => true,
   ...SHOULD_HAVE_ENERGY,
};
