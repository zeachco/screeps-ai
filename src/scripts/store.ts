import { ICreep, IRoleConfig } from '../types';
import { countCreepsByRole, SHOULD_HAVE_ENERGY, moveToOptions } from '../utils';

export const run = (creep: ICreep) => {
   const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s: StructureExtension) =>
         s.isActive() && s.energyCapacity > 0 && s.energy < s.energyCapacity,
   });

   // TODO prioritize by ENERGY_STRUCT_BY_NEEDS

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
   roomRequirements: ({ room }, cs) =>
      countCreepsByRole(cs, 'store') < cs.length / 1 ||
      room.energyAvailable < 300,
   ...SHOULD_HAVE_ENERGY,
};
