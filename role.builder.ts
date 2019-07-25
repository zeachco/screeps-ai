import { ICreep } from './enums';
import { harvestSourceBasedOfIndex, log } from './utils';

const buildingPriorities = ['tower', 'extension', 'road'].reverse();

export function builderAI(creep: ICreep, index: number) {
   if (creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
   }
   if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      creep.memory.building = true;
   }

   if (creep.memory.building) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

      const bestTargets = targets.sort(
         (a, b) =>
            buildingPriorities.indexOf(b.structureType) -
            buildingPriorities.indexOf(a.structureType)
      );

      if (bestTargets.length) {
         log(
            `${bestTargets.length} constructions site(s):`,
            bestTargets.map((s) => s.structureType).join(', ')
         );
         if (creep.build(bestTargets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(bestTargets[0], {
               visualizePathStyle: { stroke: '#ffffff' },
            });
         }
      }
   } else {
      harvestSourceBasedOfIndex(creep, index);
   }
}
