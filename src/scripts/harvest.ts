import { ICreep, IRoleConfig } from '../types';
import { doesCreepCan, moveToOptions, random } from '../utils';

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

export const ROLE_HARVEST: IRoleConfig = {
   name: 'harvest',
   run,
   roomRequirements: (spawn) => true,
   onStart: (c) => {
      const sources = c.room
         .find(FIND_SOURCES_ACTIVE)
         .map((s, i) => ({
            index: i,
            energy: s.energy,
            ...s,
         }))
         .sort((a, b) => b.energy - a.energy);

      const allCreeps = c.room.find(FIND_MY_CREEPS) as ICreep[];

      const powerCreeps = allCreeps
         .filter((c: ICreep) => c.memory.role === 'harvest')
         .reduce(
            (acc: number[], c: ICreep) => {
               return [];
            },
            [] as number[]
         );

      console.log(JSON.stringify(powerCreeps));

      const index = random(1); // || sources[0].index;
      c.say(`harvest[${index}]`);
      c.memory.targetSourceIndex = index;
   },
   shouldRun: (c) =>
      doesCreepCan(c, [WORK, CARRY]) && c.carry.energy < c.carryCapacity,
   shouldStop: (c) => c.carry.energy === c.carryCapacity,
};
