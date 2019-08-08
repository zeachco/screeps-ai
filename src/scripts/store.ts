import { ICreep, IRoleConfig } from '../types';
import { countCreepsByRole, moveToOptions } from '../utils';

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
   shouldRun: ({ spawn, creeps, creep }) =>
      countCreepsByRole(creeps, 'store') < creeps.length / 1 ||
      (spawn.room.energyAvailable < 300 && creep.carry.energy > 0),
   shouldStop: ({ creep }) => creep.carry.energy === 0,
};
