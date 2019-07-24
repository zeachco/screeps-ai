import { harvestSourceBasedOfIndex } from './utils';
import { ICreep } from './enums';

export function fighterAI(creep: ICreep, index: number) {
   const closestDamagedStructure = creep.pos.findClosestByRange(
      FIND_STRUCTURES,
      {
         filter: structure => structure.hits < structure.hitsMax,
      }
   );
   if (closestDamagedStructure) {
      creep.repair(closestDamagedStructure);
   }

   const closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
   if (closestHostile) {
      creep.attack(closestHostile);
   }

   if (creep.memory.upgrading && creep.carry.energy == 0) {
      creep.memory.upgrading = false;
      creep.say('🔄 harvest');
   }

   if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
      creep.memory.upgrading = true;
      creep.say('⚡ upgrade');
   }

   if (creep.memory.upgrading) {
      if (
         creep.upgradeController(creep.room
            .controller as StructureController) == ERR_NOT_IN_RANGE
      ) {
         creep.moveTo(creep.room.controller as StructureController, {
            visualizePathStyle: { stroke: '#ffffff' },
         });
      }
   } else {
      harvestSourceBasedOfIndex(creep, index);
   }
}
