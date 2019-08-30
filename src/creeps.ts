import { log, changeCreepRole } from './utils';
import { IRoleConfig, ICreep, IRunnerInjections, IRoom } from './types';
import { ROLES, rolesDispatch, SHOW_ROLES } from './config';
import { ROLE_IDLE } from './scripts/idle';
import { manageDyingCreep } from './inventory';

export const creepRunner = (room: IRoom, allSpawnCreeps: ICreep[]) => {
   // log(room.memory.roles);

   // const spawn = room.find(FIND_MY_SPAWNS)[0];
   // room
   //    .find(FIND_MY_STRUCTURES, {
   //       filter(s) {
   //          return getPositionDistance(s.pos, spawn.pos) < 4;
   //       },
   //    })
   //    .forEach((s) => {
   //       room.visual.circle(s.pos.x, s.pos.y, {
   //          fill: 'rgba(0, 255, 0, .5)',
   //          radius: 0.5,
   //       });
   //    });

   allSpawnCreeps.forEach((creep) => {
      if (typeof creep.ticksToLive === 'number' && creep.ticksToLive < 100) {
         manageDyingCreep(room, creep);
         return;
      }

      if (creep.memory.role === 'manual') {
         return;
      }
      if (!creep.memory.role) {
         changeCreepRole(room, creep, 'idle');
      }
      let role: IRoleConfig = ROLES[creep.memory.role];

      if (!role) {
         log(`${creep.name} have unexisting role "${creep.memory.role}"`);
      }

      const inject: IRunnerInjections = {
         creep,
         room,
         creeps: allSpawnCreeps,
      };

      // Need a new role?
      if (role === ROLE_IDLE || role.shouldStop(inject)) {
         const sortedRoles = rolesDispatch.sort(
            (a, b) => b.getPriority(room) - a.getPriority(room)
         );
         // log(
         //    sortedRoles.map((r) => `${r.name}(${r.getPriority(inject)})`).join(', ')
         // );
         for (let i = 0; i < sortedRoles.length; i++) {
            const newRole = sortedRoles[i];
            if (newRole.shouldRun(inject)) {
               role = newRole;
               break;
            }
         }

         changeCreepRole(room, creep, role.name);
         if (role.onStart) {
            role.onStart(inject);
         } else {
            creep.say(role.name);
         }
      }

      const { ticksToLive = 101 } = creep;

      if (ticksToLive < 100) {
         creep.say(`${creep.ticksToLive} ${creep.memory.role}`);
      }
      // TOO update stats
      try {
         if (role && role.run) {
            if (SHOW_ROLES) {
               creep.say(`${creep.ticksToLive} ${creep.memory.role}`);
            }
            role.run(creep);
            // changeCreepRole(room, creep, role.name);
         } else {
            throw 'Missing run script in config';
         }
      } catch (error) {
         log(error);
         creep.say('ERROR!');
      }
   });
};
