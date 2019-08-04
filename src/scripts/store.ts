import { ICreep, IRoleConfig } from '../types';
import { energyStructureByOrder } from '../config';
import { countCreepsByRole, SHOULD_HAVE_ENERGY } from '../utils';

export const run = (creep: ICreep) => {
   const byPriority = (str: Structure) =>
      energyStructureByOrder.indexOf(str.structureType as any);

   const targets = creep.room
      .find(FIND_STRUCTURES, {
         filter: (str) =>
            energyStructureByOrder.indexOf(str.structureType as any) !== -1 &&
            str.isActive(),
      })
      // TODO get power structure type (any)
      .filter((str: any) => str.energy < str.energyCapacity)
      .sort((a, b) => byPriority(a) - byPriority(b));

   if (targets.length) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
         creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: '#ffffff' },
         });
      }
   }
};

export const ROLE_STORE: IRoleConfig = {
   name: 'store',
   run,
   roomRequirements: ({ energy, energyCapacity }, cs) =>
      energy < energyCapacity && countCreepsByRole(cs, 'store') < 2,
   ...SHOULD_HAVE_ENERGY,
};
