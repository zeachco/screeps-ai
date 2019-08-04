import { log, random } from './utils';
import { ICreep, ISpawn, ICreepMemory } from './types';
import { MAX_CREEPS, BODY_TIERS, CREEPS_PER_TIERS } from './config';

export function manageInventory(spawn: ISpawn, creeps: ICreep[]) {
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
