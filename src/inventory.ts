import { log } from './utils';
import { ICreep, ISpawn, ICreepMemory } from './types';
import { MIN_CREEPS, MAX_CREEPS } from './config';

const creepFactory = (budget: number) => {
   const parts: BodyPartConstant[] = [];
   let cost = 0;
   let index = 0;
   const preset: BodyPartConstant[] = [
      CARRY,
      MOVE,
      WORK,
      MOVE,
      CARRY,
      MOVE,
      WORK,
      MOVE,
      CARRY,
      MOVE,
      WORK,
      MOVE,
      CARRY,
      MOVE,
      ATTACK,
      MOVE,
   ];
   while (cost <= budget) {
      const presetIndex = index % preset.length;
      const part = preset[presetIndex] || RANGED_ATTACK;
      cost += BODYPART_COST[part];
      if (cost > budget) return parts;
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
   const roomCapacityFull =
      creeps.length < MAX_CREEPS &&
      spawn.room.energyAvailable === spawn.room.energyCapacityAvailable;

   if (creeps.length < MIN_CREEPS || roomCapacityFull) {
      const currentEnergy = spawn.room.energyAvailable;
      const targetPrice = currentEnergy;
      const body = creepFactory(targetPrice);
      const tier = body.length - 2;

      if (
         !spawn.memory.creepId ||
         Math.min(...creeps.map((c) => +c.name.split('_')[1])) > MIN_CREEPS
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
               COST_PER_PART})`,
            body
         );
      } else if (result === ERR_NAME_EXISTS) {
         log(`Failed to create creep with name ${newName}`);
      } else if (result !== ERR_BUSY) {
         log(`Failed to create creep with error ${result}`);
      }
   }
}
