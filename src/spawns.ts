import { ICreep, ISpawn } from './types';
import { turretAI } from './role.turret';
import { creepRunner } from './creeps';
import { manageInventory } from './inventory';

export function manageSpawn(spawn: ISpawn) {
   const allSpawnCreeps = spawn.room.find(FIND_MY_CREEPS) as ICreep[];
   creepRunner(spawn, allSpawnCreeps);
   turretAI(spawn, allSpawnCreeps);
   manageInventory(spawn, allSpawnCreeps);
}
