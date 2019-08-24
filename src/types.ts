export type TRoleName =
   | 'idle'
   | 'harvest'
   | 'store'
   | 'build'
   | 'upgrade'
   | 'claim'
   | 'repair';

export interface IRolesMap {
   [key: string]: IRoleConfig;
}

export interface IRunnerInjections {
   spawn: ISpawn;
   creep: ICreep;
   creeps: ICreep[];
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
