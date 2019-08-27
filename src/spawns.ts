import { ICreep, IRoom } from './types';
import { turretAI } from './role.turret';
import { creepRunner } from './creeps';
import { manageInventory } from './inventory';
import { getCreepsByRole } from './utils';

export function manageRoom(room: IRoom) {
   const localCreeps = (room.find(FIND_MY_CREEPS) as ICreep[]).filter(
      (c: ICreep) => c.memory.role !== 'claim'
   );
   const claimers = getCreepsByRole(room, 'claim');
   const allSpawnCreeps = [...localCreeps, ...claimers] as ICreep[];
   creepRunner(room, allSpawnCreeps);
   turretAI(room, allSpawnCreeps);
   manageInventory(room, allSpawnCreeps);
}
