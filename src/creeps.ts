import { log } from './utils';
import { IRoleConfig, ICreep, ISpawn } from './types';
import { ROLES, rolesDispatch, SHOW_ROLES } from './config';
import { ROLE_IDLE } from './scripts/idle';
import { ROLE_STORE } from './scripts/store';

const findRole = (
   spawn: ISpawn,
   creep: ICreep,
   creeps: ICreep[]
): IRoleConfig => {
   const roles: IRoleConfig[] = rolesDispatch.filter((need) =>
      need.roomRequirements(spawn, creeps)
   );

   for (let i = 0; i < roles.length; i++) {
      const newRole = roles[i];
      if (newRole.shouldRun(creep)) {
         return newRole;
      }
   }

   return ROLE_IDLE;
};

export const creepRunner = (spawn: ISpawn, allSpawnCreeps: ICreep[]) => {
   allSpawnCreeps.forEach((creep) => {
      if (!creep.memory.role) {
         creep.memory.role = 'idle';
      }
      let role: IRoleConfig = ROLES[creep.memory.role];

      if (!role) {
         log(`${creep.name} have unexisting role "${creep.memory.role}"`);
      }

      // Need a new role?
      if (
         role === ROLE_IDLE ||
         role.shouldStop(creep) ||
         !role.roomRequirements(spawn, allSpawnCreeps)
      ) {
         role = findRole(spawn, creep, allSpawnCreeps);
         creep.memory.role = role.name;
         if (role.onStart) {
            role.onStart(creep);
         } else {
            creep.say(role.name);
         }
      }

      try {
         if (role && role.run) {
            if (SHOW_ROLES) creep.say(role.name);
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
