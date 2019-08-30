import { ICreep, IRoleConfig, IRoom } from '../types';
import {
   doesCreepCan,
   moveToOptions,
   createMapFromArray,
   energySourceQualifiesForCreep,
   getCreepAvailableSpace,
   changeCreepRole,
} from '../utils';

export const findBestEnergySource = (creep: ICreep) => {
   // TODO smart ressources

   const allCreeps = creep.room.find(FIND_MY_CREEPS) as ICreep[];
   const sources = creep.room
      .find(FIND_SOURCES_ACTIVE)
      .filter((s) => energySourceQualifiesForCreep(s as any, creep));

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
   // first pick decaying resources
   const target = creep.room.find(FIND_DROPPED_RESOURCES)[0];
   if (target) {
      creep.say('mine!');
      if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
         creep.moveTo(target, moveToOptions('#ffff00'));
      }
      creep.room.visual.line(
         creep.pos.x,
         creep.pos.y,
         target.pos.x,
         target.pos.y,
         {
            color: 'rgba(255, 0, 128, 0.8)',
            width: 0.3,
         }
      );
      return;
   }

   // then get the reserves
   const sources = creep.room.find(FIND_SOURCES, {
      filter: (s) => s && s.energy > 0,
   });
   const selectIndex = creep.memory.targetSourceIndex;

   if (!sources.length) {
      changeCreepRole(creep.room as IRoom, creep, 'idle');
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
   // onStart: ({ creep }: IRunnerInjections) => creep,
   shouldRun({ creep }) {
      return (
         doesCreepCan(creep, [WORK, CARRY]) && getCreepAvailableSpace(creep) > 0
      );
   },
   shouldStop({ creep }) {
      return !getCreepAvailableSpace(creep);
   },
   getPriority() {
      return 0;
   },
};
