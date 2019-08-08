import { ICreep, TRoleName, ISpawn } from './types';

export const random = (max: number, min = 0) =>
   Math.round(Math.random() * (max - min));

export const arrayFill = (
   count: number,
   fn: (index?: number) => any = (i) => i
) =>
   Array(count)
      .fill(undefined)
      .map((_, i) => fn(i));

export const createMapFromArray = (arr: any[], fill: any = 0) => {
   const map = {} as any;
   for (const i in arr) {
      map[i] = fill;
   }
   return map;
};

export const energySpawnHaveEnoughtEnergy = (
   eSpawn: StructurePowerSpawn,
   creep: ICreep
) => creep.body.filter((b) => b.type === CARRY).length * 50 < eSpawn.energy;

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

export function log(...arg: any[]) {
   console.log(...arg);
}

export function clean() {
   for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
         delete Memory.creeps[name];
         console.log('Clearing non-existing creep memory:', name);
      }
   }
}

export const findStructureAroundSpawn = (
   spawn: ISpawn,
   structureType?: string,
   from = FIND_MY_STRUCTURES
): StructureTower[] => {
   let towers: StructureTower[] = [];

   let options: any = {};

   if (structureType) {
      options.filter = { structureType };
   }

   towers = spawn.room.find(from, options) as StructureTower[];
   if (!towers.length) {
      log(`Warning: no tower(s) found around ${spawn.name}`);
   }

   return towers;
};

export const getBodyParts = (creep: ICreep) => creep.body.map((b) => b.type);

export const doesCreepCan = (
   creep: ICreep,
   partsRequired: BodyPartConstant[]
) =>
   partsRequired.reduce(
      (ok, part) => ok && creep.body.map((b) => b.type).indexOf(part) !== -1,
      true
   );

export const countCreepsByRole = (creeps: ICreep[], role: TRoleName) =>
   creeps.reduce((acc, c) => (c.memory.role === role ? acc + 1 : acc), 0);

export const moveToOptions = (color = '#000000'): MoveToOpts => ({
   visualizePathStyle: { stroke: color },
   // ignoreCreeps: true,
});
