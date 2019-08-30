import { ICreep, IRoleConfig, IRoom } from '../types';
import {
   countCreepsByRole,
   moveToOptions,
   changeCreepRole,
   log,
} from '../utils';

export const run = (creep: ICreep) => {
   const targets = creep.room
      .find<StructureExtension>(FIND_MY_STRUCTURES, {
         filter(s: StructureExtension) {
            return (
               s.isActive() &&
               s.energyCapacity > 0 &&
               s.energy < s.energyCapacity
            );
         },
      })
      .sort((a, b) => a.energy - b.energy);

   const target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter(s: StructureExtension) {
         return (
            s.isActive() &&
            s.energyCapacity > 0 &&
            s.energy < s.energyCapacity &&
            // get only the lowest enery
            targets[0].energy === s.energy
         );
      },
   });

   if (target) {
      const atempt = creep.transfer(target, RESOURCE_ENERGY);
      if (atempt === ERR_NOT_IN_RANGE) {
         creep.moveTo(target, moveToOptions('#ff88ff'));
      }
   } else {
      changeCreepRole(creep.room as IRoom, creep, 'idle');
   }
};

export const ROLE_STORE: IRoleConfig = {
   name: 'store',
   priority: 0,
   run,
   shouldRun({ room, creeps, creep }) {
      return (
         creep.carry.energy > 0 &&
         (countCreepsByRole(creeps, 'store') < 1 ||
            room.energyAvailable < room.energyCapacityAvailable)
      );
   },
   shouldStop({ creep }) {
      return creep.carry.energy === 0;
   },
   updatePriority(room) {
      let score = 1;
      if (room.energyAvailable < 300) {
         score += 25;
      }
      if (room.energyAvailable < room.energyCapacityAvailable) {
         score += 10;
      }
      return score / (Object.keys(room.memory.roles.store).length || 1);
   },
};
