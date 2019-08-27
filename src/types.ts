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
   nextCreepId: 0,
   roles: {
      harvest: idList,
      store: idList,
      defend: idList,
      upgrade: idList,
      claim: idList,
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
   spawn?: ISpawn;
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
   getPriority: (injections: IRunnerInjections) => number;
}

export const DEFAULT_CREEP_MEMORY = {
   role: 'idle' as TRoleName,
   targetSourceIndex: 0,
};

export interface ICreep extends Creep {
   memory: typeof DEFAULT_CREEP_MEMORY;
}

type TObjectID = string;

export interface ISpawnMemory extends SpawnMemory {
   creepId: number;
   roles: {
      [key: string]: TObjectID[];
   };
}

export interface ISpawn extends StructureSpawn {
   memory: ISpawnMemory;
}
