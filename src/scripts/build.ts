import { ICreep, IRoleConfig, IRunnerInjections } from '../types';
import { countCreepsByRole, moveToOptions } from '../utils';

const run = (creep: ICreep) => {
   const closestSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {
      filter: (structure) => structure.progress < structure.progressTotal,
   });

   if (closestSite) {
      if (creep.build(closestSite) === ERR_NOT_IN_RANGE) {
         creep.moveTo(closestSite, moveToOptions('#ff00ff'));
      }
   } else {
      creep.memory.role = 'idle';
   }
};

export const ROLE_BUILD: IRoleConfig = {
   name: 'build',
   run,
   shouldRun: ({ creep, spawn, creeps }: IRunnerInjections) =>
      creep.carry.energy > 0 &&
      !!spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length &&
      countCreepsByRole(creeps, 'build') < 1,
   shouldStop: ({ creep, spawn }) =>
      creep.carry.energy === 0 ||
      !spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length,
};
