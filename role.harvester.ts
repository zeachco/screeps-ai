import { harvestSourceBasedOfIndex } from './utils';

import { ICreep } from './enums';

export function harvesterAI(creep: ICreep, index: number) {
   if (creep.carry.energy < creep.carryCapacity) {
      harvestSourceBasedOfIndex(creep, index);
   } else {
      var targets = creep.room.find(FIND_STRUCTURES, {
         filter: structure => {
            return (
               (structure.structureType == STRUCTURE_EXTENSION ||
                  structure.structureType == STRUCTURE_SPAWN ||
                  structure.structureType == STRUCTURE_TOWER) &&
               structure.energy < structure.energyCapacity
            );
         },
      });
      if (targets.length > 0) {
         if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {
               visualizePathStyle: { stroke: '#ffffff' },
            });
         }
      }
   }
}
