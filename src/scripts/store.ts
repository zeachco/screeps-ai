import { ICreep, IRoleConfig } from '../types';
import { energyStructureByOrder } from '../config';
import { countCreepsByRole, SHOULD_HAVE_ENERGY } from '../utils';

export const run = (creep: ICreep) => {
   // const byPriority = (str: Structure) =>
   //    energyStructureByOrder.indexOf(str.structureType as any);

   const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s: StructureExtension) =>
         s.isActive() && s.energyCapacity > 0 && s.energy < s.energyCapacity,
   });

   if (target) {
      const atempt = creep.transfer(target, RESOURCE_ENERGY);
      if (atempt === ERR_NOT_IN_RANGE) {
         creep.moveTo(target, {
            visualizePathStyle: { stroke: '#ffffff' },
         });
      }
   }

   // const targets = creep.room
   //    // pos.findClosestByRange
   //    .find(FIND_STRUCTURES, {
   //       filter: (s: StructureExtension) =>
   //          energyStructureByOrder.indexOf(s.structureType as any) !== -1 &&
   //          s.isActive() &&
   //          s.energy < s.energyCapacity,
   //    })
   //    // TODO get power structure type (any)
   //    .filter((str: any) => str.energy < str.energyCapacity)
   //    .sort((a, b) => byPriority(a) - byPriority(b));

   // if (targets.length) {
   //    const atempt = creep.transfer(targets[0], RESOURCE_ENERGY);
   //    if (atempt === ERR_NOT_IN_RANGE) {
   //       creep.moveTo(targets[0], {
   //          visualizePathStyle: { stroke: '#ffffff' },
   //       });
   //    }
   // }
};

export const ROLE_STORE: IRoleConfig = {
   name: 'store',
   run,
   roomRequirements: ({ energy, energyCapacity }, cs) =>
      countCreepsByRole(cs, 'store') < 2,
   ...SHOULD_HAVE_ENERGY,
};
