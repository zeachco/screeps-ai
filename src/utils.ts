import { ICreep, TRoleName, IRoom } from './types';

export function random(max: number, min = 0) {
   return Math.round(Math.random() * (max - min));
}

export function arrayFill(
   count: number,
   fn: (index?: number) => any = (i) => i
) {
   return Array(count)
      .fill(undefined)
      .map((_, i) => fn(i));
}

export function createMapFromArray(arr: any[], fill: any = 0) {
   const map = {} as any;
   for (const i in arr) {
      map[i] = fill;
   }
   return map;
}

export function energySourceQualifiesForCreep(
   eSpawn: StructurePowerSpawn,
   creep: ICreep
) {
   return getCreepAvailableSpace(creep) <= eSpawn.energy;
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

export function findStructureAroundSpawn<T>(
   room: Room,
   structureType?: string,
   from = FIND_MY_STRUCTURES
): T[] {
   let structures: T[] = [];

   let options: any = {};

   if (structureType) {
      options.filter = { structureType };
   }

   structures = room.find(from, options) as any[];
   // if (!structures.length) {
   //    log(`Warning: no ${structureType}(s) found around ${spawn.name}`);
   // }

   return structures as T[];
}

export function getBodyParts(creep: ICreep) {
   return creep.body.map((b) => b.type);
}

export function doesCreepCan(creep: ICreep, partsRequired: BodyPartConstant[]) {
   return partsRequired.reduce(
      (ok, part) => ok && creep.body.map((b) => b.type).indexOf(part) !== -1,
      true
   );
}

export function countCreepsByRole(creeps: ICreep[], role: TRoleName) {
   return creeps.reduce(
      (acc, c) => (c.memory.role === role ? acc + 1 : acc),
      0
   );
}

export function moveToOptions(color = '#000000'): MoveToOpts {
   return {
      visualizePathStyle: { stroke: color },
      // ignoreCreeps: true,
   };
}

export const ttl = (creep: ICreep) =>
   typeof creep.ticksToLive === 'number' ? creep.ticksToLive : -1;

export const getCreepUsedCargo = (creep: ICreep): number => {
   type TElements = keyof (typeof creep.carry);
   const elements = Object.keys(creep.carry) as TElements[];
   return elements.reduce((remaining: number, element: TElements) => {
      return remaining + (creep.carry[element] || 0);
   }, 0);
};

export const getCreepAvailableSpace = (creep: ICreep): number =>
   creep.carryCapacity - getCreepUsedCargo(creep);

export function getCreepsByRole(room: IRoom, role: TRoleName): ICreep[] {
   return room.memory.roles[role]
      .map((id) => Game.getObjectById(id) as ICreep)
      .filter((creep) => !!creep && creep.memory.role === role);
}

export function getObjects<T>(ids: string[]) {
   return ids.map((id) => Game.getObjectById(id)) as T[];
}

interface IMemoryObj {
   [key: string]: any;
}
export function prepareMemory<T>(
   obj: { memory: IMemoryObj },
   defaultMem: IMemoryObj
) {
   // if we have at least one key,
   // let's skip setting up the memory
   for (const key in obj.memory) {
      return (obj as any) as T;
   }

   obj.memory = defaultMem;

   return (obj as any) as T;
}

interface IPosition {
   x: number;
   y: number;
}
export function getPositionDistance(pos1: IPosition, pos2: IPosition) {
   const dx = pos1.x - pos2.x;
   const dy = pos1.y - pos2.y;
   return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}
