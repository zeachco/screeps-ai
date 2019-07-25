import { log } from './utils';

const CREEPS_PER_TIERS = 3;
const MAX_CREEPS = 10;

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

export function updateInventory() {
   const creeps = Object.keys(Game.creeps).map((name) => Game.creeps[name]);

   if (creeps.length < MAX_CREEPS) {
      for (
         let index = BODY_TIERS.length - 1;
         index >= creeps.length / CREEPS_PER_TIERS;
         index--
      ) {
         const newName = `T${index + 1}-${Game.time}`;

         const result = Game.spawns['Spawn1'].spawnCreep(
            BODY_TIERS[index],
            newName,
            { memory: {} }
         );

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
