import { ICreep, IRoleConfig } from '../types';
import {
   doesCreepCan,
   moveToOptions,
   random,
   arrayFill,
   createMapFromArray,
   energySpawnHaveEnoughtEnergy,
} from '../utils';

const run = (creep: ICreep) => {
   // first pick decaying resources
   const targets = creep.room.find(FIND_DROPPED_RESOURCES);
   if (targets.length) {
      if (creep.pickup(targets[0]) === ERR_NOT_IN_RANGE) {
         creep.moveTo(targets[0], moveToOptions('#ffff00'));
      }
      return;
   }

   // then get the reserves
   const sources = creep.room.find(FIND_SOURCES);
   const selectIndex = creep.memory.targetSourceIndex;

   if (sources[selectIndex]) {
      if (creep.harvest(sources[selectIndex]) == ERR_NOT_IN_RANGE) {
         creep.moveTo(sources[selectIndex], moveToOptions('#ffff00'));
      }
   }
};

interface IStats {
   [key: string]: number;
}

export const ROLE_HARVEST: IRoleConfig = {
   name: 'harvest',
   run,
   roomRequirements: (spawn) => true,
   onStart: (c) => {
      // TODO smart ressources

      const allCreeps = c.room.find(FIND_MY_CREEPS) as ICreep[];
      const sources = c.room
         .find(FIND_SOURCES_ACTIVE)
         .filter((s) => energySpawnHaveEnoughtEnergy(s as any, c));

      const sourcesStats = allCreeps
         .filter((c: ICreep) => c.memory.role === 'harvest')
         .reduce(
            (acc: IStats, c: ICreep) => {
               acc[c.memory.targetSourceIndex]++;
               return acc;
            },
            createMapFromArray(sources) as IStats
         );

      const sourcesByOccupation = sources
         .map((s, i) => ({
            index: i,
            creeps: sourcesStats[i],
         }))
         .sort((a, b) => a.creeps - b.creeps);

      const index = sourcesByOccupation[0].index;
      c.say(`harvest[${index}]`);
      c.memory.targetSourceIndex = index;
   },
   shouldRun: (c) =>
      doesCreepCan(c, [WORK, CARRY]) && c.carry.energy < c.carryCapacity,
   shouldStop: (c) => c.carry.energy === c.carryCapacity,
};
