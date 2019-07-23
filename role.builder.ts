import { ICreep } from './enums';
import { harvestSourceBasedOfIndex, log } from './utils';

export function builderAI(creep: ICreep, index: number) {
   if (creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
      creep.say('🔄 harvest');
   }
   if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      creep.memory.building = true;
      creep.say('🚧 build');
   }

   if (creep.memory.building) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

      const bestTargets = targets.sort((a, b) => {
         return 0;
      });

      if (bestTargets.length) {
         log(
            `${bestTargets.length} construction site(s) pending`,
            bestTargets.map(s => s.structureType).join(', ')
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
