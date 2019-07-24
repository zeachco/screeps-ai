import { harvestSourceBasedOfIndex, findStructureAroundSpawn } from './utils';

import { ICreep } from './enums';

export function harvesterAI(creep: ICreep, index: number) {
   if (creep.carry.energy < creep.carryCapacity) {
      const targets = creep.room.find(FIND_DROPPED_RESOURCES);
      if (targets.length) {
         creep.moveTo(targets[0]);
         creep.pickup(targets[0]);
      } else {
         harvestSourceBasedOfIndex(creep, index);
      }
   } else {
      const lowestTurret = findStructureAroundSpawn('Spawn1', STRUCTURE_TOWER)
         .sort((a, b) => a.energy - b.energy)
         .filter(turret => turret.energy < turret.energyCapacity)[0];

      if (lowestTurret) {
         if (
            creep.transfer(lowestTurret, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
         ) {
            creep.moveTo(lowestTurret, {
               visualizePathStyle: { stroke: '#ff0000' },
            });
         }
      } else {
         const targets = creep.room.find(FIND_STRUCTURES, {
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
            if (
               creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
            ) {
               creep.moveTo(targets[0], {
                  visualizePathStyle: { stroke: '#ffffff' },
               });
            }
         }
      }
   }
}
