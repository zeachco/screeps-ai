import { findCreepByRole, log } from './utils';
import { TRole } from './enums';
import { creepPresets } from './config';

let id = 0;
const CREEPS_PER_TIERS = 2;

const ALL_USAGE_T1 = [RANGED_ATTACK, WORK, CARRY, ATTACK, MOVE];
const ALL_USAGE_T2 = [MOVE, RANGED_ATTACK, WORK, CARRY, ATTACK, MOVE];
const ALL_USAGE_T3 = [MOVE, RANGED_ATTACK, WORK, WORK, CARRY, ATTACK, MOVE];
const ALL_USAGE_T4 = [
   MOVE,
   MOVE,
   RANGED_ATTACK,
   WORK,
   WORK,
   CARRY,
   ATTACK,
   MOVE,
];

export const ALL_USAGE_ALL = [
   ALL_USAGE_T1,
   ALL_USAGE_T2,
   ALL_USAGE_T3,
   ALL_USAGE_T4,
];

export function updateInventory() {
   (Object.keys(creepPresets) as TRole[]).forEach((role) => {
      const creeps = findCreepByRole(role);
      const config = creepPresets[role];
      if (creeps.length < config.nb) {
         const bodyIndex = Math.round(
            Math.min(creeps.length / CREEPS_PER_TIERS, config.body.length) - 1
         );

         const newName =
            role === 'polyrole'
               ? `T${bodyIndex + 1}-${id}`
               : `${role}_${Game.time}`;

         if (id > 99) {
            id = 0;
         }

         const spawnAtempt = Game.spawns['Spawn1'].spawnCreep(
            config.body[bodyIndex],
            newName,
            {
               memory: { role },
            }
         );

         if (spawnAtempt === ERR_NOT_ENOUGH_ENERGY) {
            log(
               `need ${config.body[bodyIndex].length *
                  100}$ for a T${bodyIndex + 1}`,
               config.body[bodyIndex]
            );
         } else if (spawnAtempt === OK) {
            log(`${newName} created`, config.body[bodyIndex]);
            id++;
         }
      } else if (creeps.length > config.nb) {
         creeps[0].suicide();
      }
   });
}
