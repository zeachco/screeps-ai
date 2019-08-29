import { log, getPositionDistance } from './utils';
import { ICreep, IRoom, DEFAULT_CREEP_MEMORY } from './types';
import { MIN_CREEPS, MAX_CREEPS, BODY_PARTS_PRESET } from './config';

const creepFactory = (budget: number) => {
   const parts: BodyPartConstant[] = [];
   let cost = 0;
   let index = 0;
   while (cost <= budget) {
      const presetIndex = index % BODY_PARTS_PRESET.length;
      const part = BODY_PARTS_PRESET[presetIndex] || RANGED_ATTACK;
      cost += BODYPART_COST[part];
      if (cost > budget) return parts;
      parts.unshift(part);
      index++;
   }
   return parts;
};

function getBodyCost(creep: ICreep) {
   return creep.body.reduce((acc, part) => {
      return (acc += BODYPART_COST[part.type]);
   }, 0);
}

export function manageDyingCreep(room: IRoom, creep: ICreep) {
   creep.say(`${creep.ticksToLive} aaAAaah`);
   const spawn = creep.room.find(FIND_MY_SPAWNS)[0];
   const container = spawn.room.find(FIND_MY_STRUCTURES, {
      filter(s) {
         return (
            s.structureType === STRUCTURE_STORAGE &&
            getPositionDistance(s.pos, spawn.pos) < 2
         );
      },
   })[0];
   if (spawn) {
      if (container) {
         // TODO go recycle / relive to spawn
         creep.moveTo(container.pos.x, container.pos.y);
      } else {
         creep.moveTo(spawn.pos.x, spawn.pos.y);
      }
      if (getBodyCost(creep) >= room.energyCapacityAvailable) {
         spawn.renewCreep(creep);
      } else {
         spawn.recycleCreep(creep);
      }
   }
}

export function manageInventory(room: IRoom, creeps: ICreep[]) {
   const roomCapacityFull =
      creeps.length < MAX_CREEPS &&
      room.energyAvailable === room.energyCapacityAvailable;

   if (creeps.length < MIN_CREEPS || roomCapacityFull) {
      const currentEnergy = room.energyAvailable;
      const targetPrice = currentEnergy;
      const body = creepFactory(targetPrice);
      if (body.length < 3) {
         return;
      }
      const tier = body.length - 2;
      const totalCost = body.reduce((acc, b) => acc + BODYPART_COST[b], 0);

      if (
         !room.memory.nextCreepId ||
         Math.min(...creeps.map((c) => +c.name.split('_')[1])) > MIN_CREEPS
      ) {
         room.memory.nextCreepId = 0;
      }

      const newName = `T${tier}_${room.memory.nextCreepId++}`;

      const spawns = room.find(FIND_MY_SPAWNS, {
         filter(spawn) {
            return !spawn.spawning;
         },
      });

      const result = spawns[0].spawnCreep(body, newName, {
         memory: DEFAULT_CREEP_MEMORY,
      });

      if (result === OK) {
         log(
            `${newName} created for ${totalCost}\n`,
            body.map((b) => `${b}(${BODYPART_COST[b]})`).join(', ')
         );
      } else if (result === ERR_NOT_ENOUGH_ENERGY) {
         log(`needs more energy for T${tier} (${currentEnergy})`, body);
      } else if (result === ERR_NAME_EXISTS) {
         log(`Failed to create creep with name ${newName}`);
      } else if (result !== ERR_BUSY) {
         log(`Failed to create creep with error ${result}`);
      }
   }
}
