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
   shouldRun: ({ creep, room, creeps }) =>
      creep.carry.energy > 0 &&
      room.find(FIND_MY_STRUCTURES, { filter: (s) => s.hits < s.hitsMax })
         .length > 0 &&
      countCreepsByRole(creeps, 'repair') < 1,
   shouldStop: ({ creep }) => creep.carry.energy === 0,
   getPriority({ room }) {
      const repairables = room.find(FIND_STRUCTURES, {
         filter(s) {
            return s.hits < s.hitsMax * 0.8 || s.hits < 1000;
         },
      });
      return repairables.length;
   },
};
