import { ICreep, IRoleConfig } from '../types';
import { moveToOptions, countCreepsByRole } from '../utils';

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
   shouldRun: ({ creep, spawn, creeps }) =>
      creep.carry.energy > 0 &&
      spawn.room.find(FIND_MY_STRUCTURES, { filter: (s) => s.hits < s.hitsMax })
         .length > 0 &&
      countCreepsByRole(creeps, 'repair') < creeps.length / 4,
   shouldStop: ({ creep }) => creep.carry.energy === 0,
};
