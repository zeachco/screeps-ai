import { ICreep, IRoleConfig } from '../types';
import { SHOULD_HAVE_ENERGY } from '../utils';

const run = (creep: ICreep) => {
   const closestDamagedStructure = creep.pos.findClosestByRange(
      FIND_STRUCTURES,
      {
         filter: (structure) => structure.hits < structure.hitsMax,
      }
   );
   if (closestDamagedStructure) {
      if (creep.repair(closestDamagedStructure) === ERR_NOT_IN_RANGE) {
         creep.moveTo(closestDamagedStructure, {
            visualizePathStyle: {
               stroke: '#00ff88',
            },
         });
      }
   }
};

export const ROLE_REPAIR: IRoleConfig = {
   name: 'repair',
   run,
   roomRequirements: ({ room }) =>
      room.find(FIND_MY_STRUCTURES, { filter: (s) => s.hits < s.hitsMax })
         .length > 0,
   ...SHOULD_HAVE_ENERGY,
};
