import { log } from './utils';
import { IRoleConfig, ICreep, IRunnerInjections, IRoom } from './types';
import { ROLES, rolesDispatch, SHOW_ROLES } from './config';
import { ROLE_IDLE } from './scripts/idle';
import { manageDyingCreep } from './inventory';

const findRole = (inject: IRunnerInjections): IRoleConfig => {
   const sortedRoles = rolesDispatch.sort(
      (a, b) => b.getPriority(inject) - a.getPriority(inject)
   );
   // log(
   //    sortedRoles.map((r) => `${r.name}(${r.getPriority(inject)})`).join(', ')
   // );
   for (let i = 0; i < sortedRoles.length; i++) {
      const newRole = sortedRoles[i];
      if (newRole.shouldRun(inject)) {
         return newRole;
      }
   }

   return ROLE_IDLE;
};

export const creepRunner = (room: IRoom, allSpawnCreeps: ICreep[]) => {
   const creep: ICreep = {} as any;
   const inj = { room, creep, creeps: [] };
   const sortedRoles = rolesDispatch.sort(
      (a, b) => b.getPriority(inj) - a.getPriority(inj)
   );
   const ctrl = room.controller as StructureController;

   room.visual.text(
      sortedRoles
         .map((r) => `${r.name.substr(0, 3)}${r.getPriority(inj)}`)
         .join(', '),
      ctrl.pos.x + 1,
      ctrl.pos.y,
      {
         align: 'left',
      }
   );

   room.visual.text(
      sortedRoles
         .filter((r) => room.memory.roles[r.name])
         .map(
            (r) => `${room.memory.roles[r.name].length}${r.name.substr(0, 3)}`
         )
         .join(', '),
      ctrl.pos.x + 1,
      ctrl.pos.y + 1,
      {
         align: 'left',
      }
   );

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
         creep.memory.role = 'idle';
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
         role = findRole(inject);
         creep.memory.role = role.name;
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
         } else {
            throw 'Missing run script in config';
         }
      } catch (error) {
         log(error);
         creep.say('ERROR!');
      }
   });
};
