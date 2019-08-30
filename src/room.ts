import { ICreep, IRoom, DEFAULT_ROOM_MEMORY } from './types';
import { turretAI } from './role.turret';
import { creepRunner } from './creeps';
import { manageInventory } from './inventory';
import { getCreepsByRole, prepareMemory, clean, log } from './utils';
import { rolesDispatch } from './config';

export function manageRoom(gameRoom: Room) {
   // SANDBOX
   // log(
   //    Game.spawns.Spawn1.room
   //       .find(FIND_MY_STRUCTURES)
   //       .filter((s) => s.structureType === 'link')
   // );

   // gameRoom.memory = {};
   const room = prepareMemory<IRoom>(gameRoom, DEFAULT_ROOM_MEMORY);

   clean(room);

   rolesDispatch.forEach((role) => (role.priority = role.updatePriority(room)));

   const sortedRoles = rolesDispatch.sort((a, b) => b.priority - a.priority);

   const ctrl = room.controller as StructureController;

   room.visual.text(
      `${ctrl.ticksToDowngrade}`,
      ctrl.pos.x + 1,
      ctrl.pos.y - 1,
      {
         align: 'left',
         color: '#f00',
      }
   );

   const textOptions: TextStyle = {
      align: 'left',
   };
   const textRolesPriorities = sortedRoles
      .map((r) => `${r.name.substr(0, 3)}${Math.round(r.priority)}`)
      .join(', ');

   const textRolesStats = sortedRoles
      .filter((r) => room.memory.roles[r.name])
      .map(
         (r) =>
            `${Object.keys(room.memory.roles[r.name]).length}${r.name.substr(
               0,
               3
            )}`
      )
      .join(', ');

   room.visual.text(
      textRolesPriorities,
      ctrl.pos.x + 1,
      ctrl.pos.y,
      textOptions
   );

   room.visual.text(
      textRolesStats,
      ctrl.pos.x + 1,
      ctrl.pos.y + 1,
      textOptions
   );

   const localCreeps = (room.find(FIND_MY_CREEPS) as ICreep[]).filter(
      (c: ICreep) => c.memory.role !== 'claim'
   );
   const claimers = getCreepsByRole(room, 'claim');
   const allSpawnCreeps = [...localCreeps, ...claimers] as ICreep[];

   creepRunner(room, allSpawnCreeps);
   turretAI(room, allSpawnCreeps);
   manageInventory(room, allSpawnCreeps);

   log(textRolesPriorities, '\n', textRolesStats);

   // log(`Updating ${room.name} `, room.memory);
}
