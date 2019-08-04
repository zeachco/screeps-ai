import { log, random } from './utils';
import { ICreep, ISpawn, ICreepMemory } from './types';
import { MAX_CREEPS, BODY_TIERS, CREEPS_PER_TIERS } from './config';

const creepFactory = (budget: number) => {
   const parts: BodyPartConstant[] = [WORK, MOVE, CARRY];
   let cost = 300;
   let index = 0;
   const preset: BodyPartConstant[] = [MOVE, WORK, MOVE, CARRY, MOVE];
   while (cost <= budget) {
      cost += 100;
      const presetIndex = index % preset.length;
      const part = preset[presetIndex] || RANGED_ATTACK;
      parts.unshift(part);
      index++;
   }
   return parts;
};

const getBudgetFor = (creepCount: number): number =>
   300 + Math.floor(creepCount) * 100;

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

         const targetPrice = getBudgetFor(creeps.length);
         const body = creepFactory(targetPrice);
         console.log('targetPrice', targetPrice, body);

         const result = spawn.spawnCreep(body, newName, {
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
