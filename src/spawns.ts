import { ICreep, ISpawn } from './types';
import { turretAI } from './role.turret';
import { creepRunner } from './creeps';
import { manageInventory } from './inventory';
import { getCreepsByRole } from './utils';

export function manageSpawn(spawn: ISpawn) {
   const localCreeps = (spawn.room.find(FIND_MY_CREEPS) as ICreep[]).filter(
      (c: ICreep) => c.memory.role !== 'claim'
   );
   const clamers = getCreepsByRole(spawn, 'claim');
   const allSpawnCreeps = [...localCreeps, ...clamers] as ICreep[];
   creepRunner(spawn, allSpawnCreeps);
   turretAI(spawn, allSpawnCreeps);
   manageInventory(spawn, allSpawnCreeps);
}
