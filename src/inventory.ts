import { log } from './utils';
import { ICreep, ISpawn, ICreepMemory } from './types';
import { MAX_CREEPS } from './config';

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

const DEFAULT_MEMORY: ICreepMemory = {
   role: 'idle',
   targetSourceIndex: 0,
};

export function manageInventory(spawn: ISpawn, creeps: ICreep[]) {
   if (creeps.length <= MAX_CREEPS) {
      const currentEnergy = spawn.room.energyAvailable;
      const targetPrice = currentEnergy;
      const body = creepFactory(targetPrice);
      const tier = body.length - 2;

      if (
         !spawn.memory.creepId ||
         Math.min(...creeps.map((c) => +c.name.split('-')[1])) > MAX_CREEPS
      ) {
         spawn.memory.creepId = 0;
      }

      const newName = `T${tier}_${spawn.memory.creepId++}`;

      const result = spawn.spawnCreep(body, newName, {
         memory: DEFAULT_MEMORY,
      });

      if (result === OK) {
         log(`${newName} created`, body);
      } else if (result === ERR_NOT_ENOUGH_ENERGY) {
         log(
            `needs more energy for T${tier} (${currentEnergy}/${body.length *
               100})`,
            body
         );
      } else if (result === ERR_NAME_EXISTS) {
         log(`Failed to create creep with name ${newName}`);
      } else if (result !== ERR_BUSY) {
         log(`Failed to create creep with error ${result}`);
      }
   }
}
