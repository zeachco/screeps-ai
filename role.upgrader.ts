import { harvestSourceBasedOfIndex } from './utils';
import { ICreep } from './enums';

export function upgraderAI(creep: ICreep, index: number) {
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
