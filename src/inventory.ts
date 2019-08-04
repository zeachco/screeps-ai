import { log } from './utils';
import { ICreep, ISpawn, ICreepMemory } from './types';
import { MAX_CREEPS, CREEPS_PER_TIERS } from './config';

const creepFactory = (budget: number) => {
   const parts: BodyPartConstant[] = [WORK, MOVE, CARRY];
   let cost = 300;
   let index = 0;
   const preset: BodyPartConstant[] = [MOVE, WORK, MOVE, CARRY, MOVE];
   while (cost <= budget) {
      cost += 100;
      if (cost > budget) return parts;
      const presetIndex = index % preset.length;
      const part = preset[presetIndex] || RANGED_ATTACK;
      parts.unshift(part);
      index++;
   }
   return parts;
};

// TODO base off available energy instead of nb of creep
const getBudgetFor = (creepCount: number): number =>
   300 + Math.floor(creepCount / CREEPS_PER_TIERS) * 100;

const DEFAULT_MEMORY: ICreepMemory = {
   role: 'idle',
   targetSourceIndex: 0,
};

export function manageInventory(spawn: ISpawn, creeps: ICreep[]) {
   if (creeps.length <= MAX_CREEPS) {
      const targetPrice = getBudgetFor(creeps.length);
      const body = creepFactory(targetPrice);
      const tier = body.length - 2;
      const newName = `T${tier}_${Game.time}`;

      const result = spawn.spawnCreep(body, newName, {
         memory: DEFAULT_MEMORY,
      });

      const currentEnergy = spawn.energy;

      if (result === OK) {
         log(`${newName} created`, body);
      } else if (result === ERR_NOT_ENOUGH_ENERGY) {
         log(
            `needs energy to ${body.length *
               100}/${targetPrice}/${currentEnergy} for a T${tier}`,
            body
         );
      } else if (result !== ERR_BUSY) {
         log(`Failed to create creep with error ${result}`);
      }
   }
}
