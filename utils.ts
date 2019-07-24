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

export function findCreepByRole(role: TRole) {
   return (Object.keys(Game.creeps) as TRole[])
      .map(key => Game.creeps[key] as ICreep)
      .filter(creep => creep.memory.role == role);
}

export const findStructureAroundSpawn = (
   spawnName: string,
   structureType?: string,
   from = FIND_MY_STRUCTURES
): StructureTower[] => {
   let towers: StructureTower[] = [];
   const spawn = Game.spawns[spawnName];
   if (spawn) {
      let options: any = {};
      if (structureType) {
         options.filter = { structureType };
      }
      towers = spawn.room.find(from, options) as StructureTower[];
      if (!towers.length) {
         log(`Warning: no tower(s) found around ${spawnName}`);
      }
   } else {
      log(`Error: could not find ${spawnName}`);
   }
   return towers;
};

export const getBodyParts = (creep: ICreep) => creep.body.map(b => b.type);
