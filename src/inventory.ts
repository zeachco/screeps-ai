import { log } from './utils';
import { ICreep, ISpawn, IRoleConfig, ICreepMemory } from './types';
import { ROLE_IDLE } from './scripts/idle';
import {
   rolesDispatch,
   ROLES,
   MAX_CREEPS,
   BODY_TIERS,
   CREEPS_PER_TIERS,
} from './config';

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

export function manageSpawn(spawn: ISpawn) {
   const allSpawnCreeps = spawn.room.find(FIND_MY_CREEPS) as ICreep[];

   allSpawnCreeps.forEach((creep) => {
      let role: IRoleConfig = ROLES[creep.memory.role];

      if (!role) {
         log(`${creep.name} have unexisting role "${creep.memory.role}"`);
      }

      // Need a new role?
      if (role === ROLE_IDLE || role.shouldStop(creep)) {
         role = findRole(spawn, creep, allSpawnCreeps);
         creep.memory.role = role.name;
         creep.say(role.name);
      }

      try {
         if (role && role.run) {
            role.run(creep);
         } else {
            throw 'Missing run script in config';
         }
      } catch (error) {
         log(error);
         creep.say('ERROR!');
      }
   });

   // INVENTORY //

   const creeps = Object.keys(Game.creeps).map((name) => Game.creeps[name]);

   if (creeps.length <= MAX_CREEPS) {
      for (
         let index = BODY_TIERS.length - 1;
         index >= creeps.length / CREEPS_PER_TIERS;
         index--
      ) {
         const newName = `T${index + 1}-${Game.time}`;

         const defaultMemory: ICreepMemory = {
            role: 'idle',
            targetSourceIndex: 0,
         };

         const result = spawn.spawnCreep(BODY_TIERS[index], newName, {
            memory: defaultMemory,
         });

         if (result === OK) {
            log(`${newName} created`, BODY_TIERS[index]);
            break;
         } else if (result === ERR_NOT_ENOUGH_ENERGY) {
            if (index <= creeps.length / CREEPS_PER_TIERS) {
               log(
                  `needs energy to ${BODY_TIERS[index].length *
                     100} for a T${index + 1}`,
                  BODY_TIERS[index]
               );
            }
         } else if (result !== ERR_BUSY) {
            log(`Failed to create creep with error ${result}`);
            break;
         }
      }
   }
}
