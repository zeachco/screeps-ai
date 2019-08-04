import { ICreep, IRoleConfig } from '../types';
import { countCreepsByRole, SHOULD_HAVE_ENERGY, moveToOptions } from '../utils';

export const run = (creep: ICreep) => {
   const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s: StructureExtension) =>
         s.isActive() && s.energyCapacity > 0 && s.energy < s.energyCapacity,
   });

   if (target) {
      const atempt = creep.transfer(target, RESOURCE_ENERGY);
      if (atempt === ERR_NOT_IN_RANGE) {
         creep.moveTo(target, moveToOptions('#ff88ff'));
      }
   }
};

export const ROLE_STORE: IRoleConfig = {
   name: 'store',
   run,
   roomRequirements: (_, cs) => countCreepsByRole(cs, 'store') < 3,
   ...SHOULD_HAVE_ENERGY,
};
