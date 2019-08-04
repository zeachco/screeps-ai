import { ICreep, IRoleConfig } from '../types';
import { SHOULD_HAVE_ENERGY, countCreepsByRole, moveToOptions } from '../utils';

const run = (creep: ICreep) => {
   const closestSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {
      filter: (structure) => structure.progress < structure.progressTotal,
   });

   if (closestSite) {
      if (creep.build(closestSite) === ERR_NOT_IN_RANGE) {
         creep.moveTo(closestSite, moveToOptions('#ff00ff'));
      }
   }
};

export const ROLE_BUILD: IRoleConfig = {
   name: 'build',
   run,
   roomRequirements: ({ room }, cs) =>
      !!room.find(FIND_MY_CONSTRUCTION_SITES).length &&
      countCreepsByRole(cs, 'build') < cs.length / 4,
   ...SHOULD_HAVE_ENERGY,
};
