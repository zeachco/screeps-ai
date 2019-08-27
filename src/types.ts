export type TRoleName =
   | 'idle'
   | 'manual'
   | 'harvest'
   | 'store'
   | 'build'
   | 'upgrade'
   | 'claim'
   | 'repair';

const idList = [] as string[];

export const DEFAULT_ROOM_MEMORY = {
   energySources: ['unknown'] as string[],
   spawns: [] as string[],
   roles: {
      harvest: idList,
      store: idList,
      defend: idList,
      upgrade: idList,
   } as { [key: string]: string[] },
};

export interface IRoom extends Room {
   memory: typeof DEFAULT_ROOM_MEMORY;
}

export interface IRolesMap {
   [key: string]: IRoleConfig;
}

export interface IRunnerInjections {
   room: IRoom;
   spawn: ISpawn;
   creep: ICreep;
   creeps: ICreep[];
}

export interface IRoleInject {
   room: IRoom;
   creep: ICreep;
}

export interface IRoleConfig {
   shouldRun: (injections: IRunnerInjections) => boolean;
   shouldStop: (injections: IRunnerInjections) => boolean;
   onStart?: (injections: IRunnerInjections) => any;
   run: (creep: ICreep) => void;
   name: TRoleName;
   getPriority?: (injections: IRunnerInjections) => number;
}

export interface ICreepMemory extends CreepMemory {
   role: TRoleName;
   targetSourceIndex: number;
}

export interface ICreep extends Creep {
   memory: ICreepMemory;
}

export interface ISpawnStats {
   total: number;
   harvest: number;
   store: number;
   upgrade: number;
   build: number;
}

type TObjectID = string;

export interface ISpawnMemory extends SpawnMemory {
   stats: ISpawnStats;
   creepId: number;
   roles: {
      [key: string]: TObjectID[];
   };
}

export interface ISpawn extends StructureSpawn {
   memory: ISpawnMemory;
}
