import { ICreep, IRoleConfig } from '../types';
import { doesCreepCan } from '../utils';

const run = (creep: ICreep) => {
   // first pick decaying resources
   const targets = creep.room.find(FIND_DROPPED_RESOURCES);
   if (targets.length) {
      if (creep.pickup(targets[0]) === ERR_NOT_IN_RANGE) {
         creep.moveTo(targets[0]);
      }
      return;
   }

   // then get the reserves
   const sources = creep.room.find(FIND_SOURCES);
   const selectIndex = 0; //index % sources.length;

   if (sources[selectIndex]) {
      if (creep.harvest(sources[selectIndex]) == ERR_NOT_IN_RANGE) {
         creep.moveTo(sources[selectIndex], {
            visualizePathStyle: { stroke: '#ffaa00' },
         });
      }
   }
};

export const ROLE_HARVEST: IRoleConfig = {
   name: 'harvest',
   run,
   roomRequirements: (spawn) => true,
   shouldRun: (c) =>
      doesCreepCan(c, [WORK, CARRY]) && c.carry.energy < c.carryCapacity,
   shouldStop: (c) => c.carry.energy === c.carryCapacity,
};
