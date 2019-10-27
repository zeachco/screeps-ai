import { ICreep, IRoleConfig, IRunnerInjections, IRoom } from '../types';
import { countCreepsByRole, moveToOptions, changeCreepRole } from '../utils';

const run = (creep: ICreep) => {
   const closestSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {
      filter: (structure) => structure.progress < structure.progressTotal,
   });

   if (closestSite) {
      if (creep.build(closestSite) === ERR_NOT_IN_RANGE) {
         creep.moveTo(closestSite, moveToOptions('#ff00ff'));
      }
   } else {
      changeCreepRole(creep.room as IRoom, creep, 'idle');
   }
};

export const ROLE_BUILD: IRoleConfig = {
   name: 'build',
   priority: 0,
   run,
   shouldRun: ({ creep, room, creeps }: IRunnerInjections) =>
      creep.carry.energy > 0 &&
      !!room.find(FIND_MY_CONSTRUCTION_SITES).length &&
      countCreepsByRole(creeps, 'build') < creeps.length / 3,
   shouldStop: ({ creep, room }) =>
      creep.carry.energy === 0 || !room.find(FIND_MY_CONSTRUCTION_SITES).length,
   updatePriority(room) {
      const len = room.find(FIND_MY_CONSTRUCTION_SITES).length;
      return len ? 50 + len : 0;
   },
};
