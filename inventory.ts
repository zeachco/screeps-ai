import { log } from './utils';

const CREEPS_PER_TIERS = 3;
const MAX_CREEPS = 30;

const BODY_TIERS = [
   [WORK, CARRY, MOVE],
   [RANGED_ATTACK, WORK, CARRY, MOVE],
   [RANGED_ATTACK, WORK, WORK, CARRY, MOVE],
   [WORK, WORK, MOVE, MOVE, CARRY, MOVE],
];

export function updateInventory() {
   const creeps = Object.keys(Game.creeps).map((name) => Game.creeps[name]);

   if (creeps.length < MAX_CREEPS) {
      const bodyIndex = Math.min(
         Math.floor(creeps.length / CREEPS_PER_TIERS),
         BODY_TIERS.length - 1
      );

      const newName = `T${bodyIndex + 1}-${Game.time}`;

      const result = Game.spawns['Spawn1'].spawnCreep(
         BODY_TIERS[bodyIndex],
         newName,
         { memory: {} }
      );

      if (result === OK) {
         log(`${newName} created`, BODY_TIERS[bodyIndex]);
      } else if (result === ERR_NOT_ENOUGH_ENERGY) {
         log(
            `need ${BODY_TIERS[bodyIndex].length * 100}$ for a T${bodyIndex +
               1}`,
            BODY_TIERS[bodyIndex]
         );
      } else if (result !== ERR_BUSY) {
         log(`Failed to create creep with error ${result}`);
      }
   }
}
