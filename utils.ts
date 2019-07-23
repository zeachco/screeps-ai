import { ICreep, TRole } from './enums';

export function harvestSourceBasedOfIndex(creep: Creep, index: number) {
   const sources = creep.room.find(FIND_SOURCES);
   const selectIndex = index % sources.length;

   const target = sources[selectIndex];

   if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, {
         visualizePathStyle: { stroke: '#ffaa00' },
      });
   }
}

export function log(...arg) {
   console.log(...arg);
}

export function clean() {
   log('---');
   for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
         delete Memory.creeps[name];
         console.log('Clearing non-existing creep memory:', name);
      }
   }
}

export function findCreepByRole(role: TRole) {
   return Object.keys(Game.creeps)
      .map(key => Game.creeps[key])
      .filter((creep: ICreep) => creep.memory.role == role);
}
