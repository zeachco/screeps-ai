import { ICreep, IRoleConfig } from '../types';
import { SHOULD_HAVE_ENERGY, moveToOptions } from '../utils';

const run = (creep: ICreep) => {
   const closestDamagedStructure = creep.pos.findClosestByPath(
      FIND_STRUCTURES,
      {
         filter: (structure) => structure.hits < structure.hitsMax,
      }
   );
   if (closestDamagedStructure) {
      if (creep.repair(closestDamagedStructure) === ERR_NOT_IN_RANGE) {
         creep.moveTo(closestDamagedStructure, moveToOptions('#0000ff'));
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
