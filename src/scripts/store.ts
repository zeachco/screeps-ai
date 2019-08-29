import { ICreep, IRoleConfig } from '../types';
import { countCreepsByRole, moveToOptions } from '../utils';

export const run = (creep: ICreep) => {
   const targets = creep.room
      .find<StructureContainer>(FIND_MY_STRUCTURES, {
         filter(s: StructureContainer) {
            return s.storeCapacity > 0;
         },
      })
      .sort((a, b) => b.store.energy - a.store.energy);
   const target =
      targets[0] ||
      creep.pos.findClosestByPath(FIND_STRUCTURES, {
         filter(s: StructureExtension) {
            return (
               s.isActive() &&
               s.energyCapacity > 0 &&
               s.energy < s.energyCapacity
            );
         },
      });

   // TODO prioritize by ENERGY_STRUCT_BY_NEEDS
   // smaller inventory first

   if (target) {
      const atempt = creep.transfer(target, RESOURCE_ENERGY);
      if (atempt === ERR_NOT_IN_RANGE) {
         creep.moveTo(target, moveToOptions('#ff88ff'));
      }
   } else {
      creep.memory.role = 'idle';
   }
};

export const ROLE_STORE: IRoleConfig = {
   name: 'store',
   run,
   shouldRun({ room, creeps, creep }) {
      return (
         creep.carry.energy > 0 &&
         (countCreepsByRole(creeps, 'store') < 1 ||
            room.energyAvailable < room.energyCapacityAvailable)
      );
   },
   shouldStop: ({ creep }) => creep.carry.energy === 0,
   getPriority(room) {
      let score = 0;
      if (room.energyAvailable < 300) {
         score += 25;
      }
      if (room.energyAvailable < room.energyCapacityAvailable) {
         score += 1;
      }
      return score / (room.memory.roles.store.length || 1);
   },
};
