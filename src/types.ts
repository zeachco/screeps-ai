export type TRoleName =
   | 'idle'
   | 'harvest'
   | 'store'
   | 'build'
   | 'upgrade'
   | 'repair';

export interface IRolesMap {
   [key: string]: IRoleConfig;
}

export interface IRoleConfig {
   roomRequirements: (spawn: ISpawn, creeps: ICreep[]) => boolean;
   shouldRun: (creep: ICreep) => boolean;
   shouldStop: (creep: ICreep) => boolean;
   onStart?: (creep: ICreep) => any;
   run: (creep: ICreep) => void;
   name: TRoleName;
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

export interface ISpawnMemory extends SpawnMemory {
   stats: ISpawnStats;
}

export interface ISpawn extends StructureSpawn {
   memory: ISpawnMemory;
}
