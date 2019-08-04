import { ICreep, IRoleConfig } from '../types';
import { countCreepsByRole, SHOULD_HAVE_ENERGY } from '../utils';

export const run = (creep: ICreep) => {
   const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s: StructureExtension) =>
         s.isActive() && s.energyCapacity > 0 && s.energy < s.energyCapacity,
   });

   if (target) {
      const atempt = creep.transfer(target, RESOURCE_ENERGY);
      if (atempt === ERR_NOT_IN_RANGE) {
         creep.moveTo(target, {
            visualizePathStyle: { stroke: '#ffffff' },
         });
      }
   }
};

export const ROLE_STORE: IRoleConfig = {
   name: 'store',
   run,
   roomRequirements: (_, cs) => countCreepsByRole(cs, 'store') < 2,
   ...SHOULD_HAVE_ENERGY,
};
