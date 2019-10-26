import { ICreep, IRoleConfig, IRoom } from '../types';
import {
   countCreepsByRole,
   moveToOptions,
   changeCreepRole,
   log,
   getCreepUsedCargo,
} from '../utils';

type TEnergyStructure =
   | StructureExtension
   | StructureStorage
   | StructureContainer
   | StructureSpawn
   | StructureLink
   | StructureTower;

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

   const storeInContainerInstead =
      getCreepUsedCargo(creep) > creep.carry.energy;

   const target = creep.pos.findClosestByPath<TEnergyStructure>(
      FIND_STRUCTURES,
      {
         filter(s: TEnergyStructure) {
            switch (s.structureType) {
               case STRUCTURE_STORAGE:
                  // log(s.structureType);
                  return storeInContainerInstead;
               case STRUCTURE_TOWER:
                  return s.energy < s.energyCapacity / 2;
               case STRUCTURE_EXTENSION:
               case STRUCTURE_SPAWN:
                  return (
                     s.isActive() &&
                     s.structureType === STRUCTURE_EXTENSION &&
                     s.energyCapacity > 0 &&
                     s.energy < s.energyCapacity &&
                     // get only the lowest enery
                     targets[0].energy === s.energy
                  );
               default:
                  // log(s.structureType);
                  return false;
            }
         },
      }
   );

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
