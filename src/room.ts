import { ICreep, IRoom, DEFAULT_ROOM_MEMORY } from './types';
import { turretAI } from './role.turret';
import { creepRunner } from './creeps';
import { manageInventory } from './inventory';
import { getCreepsByRole, prepareMemory, log } from './utils';

export function manageRoom(gameRoom: Room) {
   // SANDBOX
   // log(
   //    Game.spawns.Spawn1.room
   //       .find(FIND_MY_STRUCTURES)
   //       .filter((s) => s.structureType === 'link')
   // );

   // gameRoom.memory = {};
   const room = prepareMemory<IRoom>(gameRoom, DEFAULT_ROOM_MEMORY);
   // log(`Updating ${room.name} `, room.memory);
   const localCreeps = (room.find(FIND_MY_CREEPS) as ICreep[]).filter(
      (c: ICreep) => c.memory.role !== 'claim'
   );
   const claimers = getCreepsByRole(room, 'claim');
   const allSpawnCreeps = [...localCreeps, ...claimers] as ICreep[];
   creepRunner(room, allSpawnCreeps);
   turretAI(room, allSpawnCreeps);
   manageInventory(room, allSpawnCreeps);
}
