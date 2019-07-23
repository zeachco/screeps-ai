import { ICreep } from './enums';
import { harvestSourceBasedOfIndex } from './utils';

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
      // console.log(targets);
      if (targets.length) {
         if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {
               visualizePathStyle: { stroke: '#ffffff' },
            });
         }
      }
   } else {
      harvestSourceBasedOfIndex(creep, index);
   }
}
