import { log } from './utils';
import { IRoleConfig, ICreep, ISpawn, IRunnerInjections } from './types';
import { ROLES, rolesDispatch, SHOW_ROLES } from './config';
import { ROLE_IDLE } from './scripts/idle';

const findRole = (inject: IRunnerInjections): IRoleConfig => {
   for (let i = 0; i < rolesDispatch.length; i++) {
      const newRole = rolesDispatch[i];
      if (newRole.shouldRun(inject)) {
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

      const inject: IRunnerInjections = {
         creep,
         spawn,
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
         creep.say(`-${creep.ticksToLive} ${creep.memory.role}`);
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
