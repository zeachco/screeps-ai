import { log } from './utils';
import {
   aiStoreEnergy,
   aiBuild,
   aiGetEnergy,
   aiUpgrade,
   aiRepair,
} from './creepAI';
import {
   ICreep,
   ISpawn,
   IRoleConfig,
   TRoleName,
   ISpawnStats,
   IRolesMap,
   ICreepMemory,
} from './types';

const CREEPS_PER_TIERS = 10;
const MAX_CREEPS = 20;

const BODY_TIERS = [
   [WORK, CARRY, MOVE],
   [WORK, WORK, CARRY, MOVE],
   [WORK, WORK, WORK, CARRY, MOVE],
   [WORK, WORK, WORK, WORK, CARRY, MOVE],
   [MOVE, WORK, WORK, WORK, CARRY, CARRY, MOVE],
   [MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, MOVE],
   [MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, ATTACK, MOVE],
   [MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, RANGED_ATTACK, MOVE],
];

const countByRole = (creeps: ICreep[], role: TRoleName) =>
   creeps.reduce((acc, c) => (c.memory.role === role ? acc + 1 : acc), 0);

const doesCreepCan = (creep: ICreep, partsRequired: BodyPartConstant[]) =>
   partsRequired.reduce(
      (ok, part) => ok && creep.body.map((b) => b.type).indexOf(part) !== -1,
      true
   );

const SHOULD_HAVE_ENERGY = {
   shouldRun: (c: ICreep) => c.carry.energy > 0,
   shouldStop: (c: ICreep) => c.carry.energy === 0,
};

const ROLE_IDLE: IRoleConfig = {
   name: 'idle',
   run: () => {
      throw 'DO NOT RUN IDLE!';
   },
   roomRequirements: () => true,
   shouldRun: () => true,
   shouldStop: () => false,
};

const ROLE_HARVEST: IRoleConfig = {
   name: 'harvest',
   run: aiGetEnergy,
   roomRequirements: (spawn) => true,
   shouldRun: (c) =>
      doesCreepCan(c, [WORK, CARRY]) && c.carry.energy < c.carryCapacity,
   shouldStop: (c) => c.carry.energy === c.carryCapacity,
};

const ROLE_STORE: IRoleConfig = {
   name: 'store',
   run: aiStoreEnergy,
   roomRequirements: ({ energy, energyCapacity }, cs) =>
      energy < energyCapacity && countByRole(cs, 'store') < 2,
   ...SHOULD_HAVE_ENERGY,
};

const ROLE_UPGRADE: IRoleConfig = {
   name: 'upgrade',
   run: aiUpgrade,
   roomRequirements: (_, cs) => countByRole(cs, 'upgrade') <= 1,
   ...SHOULD_HAVE_ENERGY,
};

const ROLE_BUILD: IRoleConfig = {
   name: 'build',
   run: aiBuild,
   roomRequirements: ({ room }) =>
      !!room.find(FIND_MY_CONSTRUCTION_SITES).length,
   ...SHOULD_HAVE_ENERGY,
};

const ROLE_REPAIR: IRoleConfig = {
   name: 'repair',
   run: aiRepair,
   roomRequirements: ({ room }) =>
      room.find(FIND_MY_STRUCTURES, { filter: (s) => s.hits < s.hitsMax })
         .length > 0,
   ...SHOULD_HAVE_ENERGY,
};

const rolesDispatch: IRoleConfig[] = [
   ROLE_UPGRADE,
   ROLE_STORE,
   ROLE_BUILD,
   ROLE_REPAIR,
   ROLE_HARVEST,
   ROLE_IDLE,
];

const ROLES: IRolesMap = rolesDispatch.reduce(
   (acc: IRolesMap, role: IRoleConfig) => {
      acc[role.name] = role;
      return acc;
   },
   {}
);

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
