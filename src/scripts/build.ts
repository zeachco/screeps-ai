import { ICreep, IRoleConfig } from '../types';
import { SHOULD_HAVE_ENERGY, countCreepsByRole } from '../utils';

const run = (creep: ICreep) => {
   const closestSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {
      filter: (structure) => structure.progress < structure.progressTotal,
   });

   if (closestSite) {
      if (creep.build(closestSite) === ERR_NOT_IN_RANGE) {
         creep.moveTo(closestSite, {
            visualizePathStyle: { stroke: '#88ff88' },
         });
      }
   }
};

export const ROLE_BUILD: IRoleConfig = {
   name: 'build',
   run,
   roomRequirements: ({ room }, cs) =>
      !!room.find(FIND_MY_CONSTRUCTION_SITES).length &&
      countCreepsByRole(cs, 'build') < cs.length / 3,
   ...SHOULD_HAVE_ENERGY,
};
