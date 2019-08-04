import { log } from './utils';
import { ICreep } from './types';
import { energyStructureByOrder } from './config';

const doesCreepCan = (creep: ICreep, partsRequired: BodyPartConstant[]) =>
   partsRequired.reduce(
      (ok, part) => ok && creep.body.map((b) => b.type).indexOf(part) !== -1,
      true
   );

export const aiDefendFromHostiles = (creep: ICreep) => {
   const closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
   if (closestHostile) {
      if (creep.carry.energy) {
         log('attacking', closestHostile);
      } else {
         log('warning: cannot attack', closestHostile, 'not enough energy');
      }
      creep.attack(closestHostile);

      const atemptAtk = (atkType: RANGED_ATTACK | ATTACK) => {
         if (doesCreepCan(creep, [atkType])) {
            const fn =
               atkType === RANGED_ATTACK ? creep.rangedAttack : creep.attack;
            if (fn(closestHostile) === ERR_NOT_IN_RANGE) {
               creep.moveTo(closestHostile);
            }
            return true;
         }
         return false;
      };

      return atemptAtk(RANGED_ATTACK) || atemptAtk(ATTACK);
   }
   return false;
};

export const aiGetEnergy = (creep: ICreep) => {
   // first pick decaying resources
   const targets = creep.room.find(FIND_DROPPED_RESOURCES);
   if (targets.length) {
      if (creep.pickup(targets[0]) === ERR_NOT_IN_RANGE) {
         creep.moveTo(targets[0]);
      }
      return;
   }

   // then get the reserves
   const sources = creep.room.find(FIND_SOURCES);
   const selectIndex = 0;//index % sources.length;

   if (sources[selectIndex]) {
      if (creep.harvest(sources[selectIndex]) == ERR_NOT_IN_RANGE) {
         creep.moveTo(sources[selectIndex], {
            visualizePathStyle: { stroke: '#ffaa00' },
         });
      }
   }
};

export const aiStoreEnergy = (creep: ICreep) => {
   const byPriority = (str: Structure) =>
      energyStructureByOrder.indexOf(str.structureType as any);

   const targets = creep.room
      .find(FIND_STRUCTURES, {
         filter: (str) =>
            energyStructureByOrder.indexOf(str.structureType as any) !== -1 &&
            str.isActive(),
      })
      // TODO get power structure type (any)
      .filter((str: any) => str.energy < str.energyCapacity)
      .sort((a, b) => byPriority(a) - byPriority(b));

   if (targets.length) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
         creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: '#ffffff' },
         });
      }
   }
};

export const aiUpgrade = (creep: ICreep) => {
   if (
      creep.upgradeController(creep.room.controller as StructureController) ===
      ERR_NOT_IN_RANGE
   ) {
      creep.moveTo(creep.room.controller as StructureController, {
         visualizePathStyle: { stroke: '#8888ff' },
      });
   }
};

export const aiBuild = (creep: ICreep) => {
   const closestSite = creep.pos.findClosestByRange(
      FIND_MY_CONSTRUCTION_SITES,
      {
         filter: (structure) => structure.progress < structure.progressTotal,
      }
   );

   if (closestSite) {
      if (creep.build(closestSite) === ERR_NOT_IN_RANGE) {
         creep.moveTo(closestSite, {
            visualizePathStyle: { stroke: '#88ff88' },
         });
      }
   }
};

export const aiRepair = (creep: ICreep) => {
   const closestDamagedStructure = creep.pos.findClosestByRange(
      FIND_STRUCTURES,
      {
         filter: (structure) => structure.hits < structure.hitsMax,
      }
   );
   if (closestDamagedStructure) {
      if (creep.repair(closestDamagedStructure) === ERR_NOT_IN_RANGE) {
         creep.moveTo(closestDamagedStructure, {
            visualizePathStyle: {
               stroke: '#00ff88'
            }
         });
      }
   }
};
