import { ICreep, IRoleConfig, IRunnerInjections } from '../types';
import {
   doesCreepCan,
   moveToOptions,
   createMapFromArray,
   energySpawnHaveEnoughtEnergy,
} from '../utils';

const findBestEnergySource = (creep: ICreep) => {
   // TODO smart ressources

   const allCreeps = creep.room.find(FIND_MY_CREEPS) as ICreep[];
   const sources = creep.room
      .find(FIND_SOURCES_ACTIVE)
      .filter((s) => energySpawnHaveEnoughtEnergy(s as any, creep));

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
   creep.say(`harvest[${index}]`);
   creep.memory.targetSourceIndex = index;
};

const run = (creep: ICreep) => {
   if (typeof creep.ticksToLive === 'number' && creep.ticksToLive < 75) {
      if (creep.carry.energy === 0) {
         creep.suicide();
      } else {
         creep.memory.role = 'idle';
      }
   }
   // first pick decaying resources
   const targets = creep.room.find(FIND_DROPPED_RESOURCES);
   if (targets.length) {
      if (creep.pickup(targets[0]) === ERR_NOT_IN_RANGE) {
         creep.moveTo(targets[0], moveToOptions('#ffff00'));
      }
      return;
   }

   // then get the reserves
   const sources = creep.room.find(FIND_SOURCES, {
      filter: (s) => s && s.energy > 0,
   });
   const selectIndex = creep.memory.targetSourceIndex;

   if (!sources.length) {
      creep.memory.role = 'idle';
      return;
   }

   if (sources[selectIndex].energy === 0) {
      findBestEnergySource(creep);
   }

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
   onStart: ({ creep }: IRunnerInjections) => creep,
   shouldRun: ({ creep }) =>
      doesCreepCan(creep, [WORK, CARRY]) &&
      creep.carry.energy < creep.carryCapacity,
   shouldStop: ({ creep }) => creep.carry.energy === creep.carryCapacity,
};
