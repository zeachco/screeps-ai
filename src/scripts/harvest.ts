import { ICreep, IRoleConfig, IRoom } from '../types';
import {
   doesCreepCan,
   moveToOptions,
   createMapFromArray,
   energySourceQualifiesForCreep,
   getCreepAvailableSpace,
   changeCreepRole,
   random,
   log,
   getCreepUsedCargo,
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
   const target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
   if (target && target.amount > 20) {
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
            color: 'rgba(255, 255, 128, 0.75)',
            width: 0.4,
         }
      );
      return;
   }

   // check bodies
   // const tomb = creep.pos.findClosestByPath(FIND_TOMBSTONES);
   // if (tomb && getCreepUsedCargo({ carry: tomb.store } as ICreep) > 0) {
   //    creep.say('oh yeah!');
   //    // if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
   //    creep.moveTo(tomb, moveToOptions('#ffff00'));
   //    // }
   //    creep.room.visual.line(creep.pos.x, creep.pos.y, tomb.pos.x, tomb.pos.y, {
   //       color: 'rgba(255, 255, 128, 0.75)',
   //       width: 0.4,
   //    });
   //    return;
   // }

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
         if (
            creep.moveTo(sources[selectIndex], moveToOptions('#ffff00')) ===
            ERR_NO_PATH
         ) {
            creep.memory.targetSourceIndex = random(1);
            creep.say(`...`);
         }
      }
   }
};

interface IStats {
   [key: string]: number;
}

export const ROLE_HARVEST: IRoleConfig = {
   name: 'harvest',
   priority: 0,
   run,
   onStart({ creep }) {
      creep.memory.targetSourceIndex = random(1);
      creep.say(`${creep.memory.targetSourceIndex} harvest`);
   },
   // onStart: ({ creep }: IRunnerInjections) => creep,
   shouldRun({ creep }) {
      return (
         doesCreepCan(creep, [WORK, CARRY]) && getCreepAvailableSpace(creep) > 0
      );
   },
   shouldStop({ creep }) {
      return !getCreepAvailableSpace(creep);
   },
   updatePriority() {
      return 0;
   },
};
