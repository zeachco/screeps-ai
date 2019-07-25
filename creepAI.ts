import { log } from './utils';
import { ICreep } from './enums';
import { energyStructureByOrder } from './config';

const doesCreepCan = (creep: ICreep, partsRequired: BodyPartConstant[]) =>
   partsRequired.reduce(
      (ok, part) => ok && creep.body.map((b) => b.type).indexOf(part) !== -1,
      true
   );

const aiDefendFromHostiles = (creep: ICreep) => {
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

const aiGetEnergy = (creep: ICreep, index: number) => {
   if (
      creep.carry.energy === creep.carryCapacity ||
      !doesCreepCan(creep, [CARRY])
   ) {
      return false;
   }

   if (creep.memory.activeScript !== 'harvest') {
      if (!creep.carry.energy) {
         creep.say(`🤑`);
         return true;
      } else {
         return false;
      }
   }

   // first pick decaying resources
   const targets = creep.room.find(FIND_DROPPED_RESOURCES);
   if (targets.length) {
      if (creep.pickup(targets[0]) === ERR_NOT_IN_RANGE) {
         creep.moveTo(targets[0]);
      }
      return true;
   }

   // then get the reserves
   const sources = creep.room.find(FIND_SOURCES);
   const selectIndex = index % sources.length;

   if (sources[selectIndex]) {
      if (creep.harvest(sources[selectIndex]) == ERR_NOT_IN_RANGE) {
         creep.moveTo(sources[selectIndex], {
            visualizePathStyle: { stroke: '#ffaa00' },
         });
      }
      return true;
   }
   return false;
};

const aiStoreEnergy = (creep: ICreep, index: number, total: number) => {
   if (!creep.carry.energy) {
      return false;
   }
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
      if (creep.memory.activeScript !== 'store') {
         creep.say(`🔽`);
      }
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
         creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: '#ffffff' },
         });
      }
      return true;
   }
   return false;
};

const aiUpgrade = (creep: ICreep) => {
   if (!creep.carry.energy || getStats().upgrade.length) {
      return false;
   }
   if (
      creep.upgradeController(creep.room.controller as StructureController) ===
      ERR_NOT_IN_RANGE
   ) {
      creep.moveTo(creep.room.controller as StructureController, {
         visualizePathStyle: { stroke: '#8888ff' },
      });
   }
   if (creep.memory.activeScript !== 'upgrade') {
      creep.say(`⬆️`);
   }
   return true;
};

const aiBuild = (creep: ICreep, index: number, total: number) => {
   if (!creep.carry.energy || getStats().build.length > 2) {
      return false;
   }

   const closestSite = creep.pos.findClosestByRange(
      FIND_MY_CONSTRUCTION_SITES,
      {
         filter: (structure) => structure.progress < structure.progressTotal,
      }
   );

   if (closestSite) {
      if (creep.memory.activeScript !== 'build') {
         creep.say(`🔨 ${closestSite.structureType}`);
      }

      if (creep.build(closestSite) === ERR_NOT_IN_RANGE) {
         creep.moveTo(closestSite, {
            visualizePathStyle: { stroke: '#88ff88' },
         });
      }
   }

   return !!closestSite;
};

const aiRepair = (creep: ICreep) => {
   if (!creep.carry.energy || getStats().repair.length) {
      return false;
   }

   const closestDamagedStructure = creep.pos.findClosestByRange(
      FIND_STRUCTURES,
      {
         filter: (structure) => structure.hits < structure.hitsMax,
      }
   );
   if (closestDamagedStructure) {
      if (creep.repair(closestDamagedStructure) === ERR_NOT_IN_RANGE) {
         creep.moveTo(closestDamagedStructure);
      }
   }
   return !!closestDamagedStructure;
};

const aiDerp = (creep: ICreep) => {
   creep.say('ikdwtd 🤪');
   return true;
};

type TRunner = (creep: ICreep, index: number, total: number) => boolean; // returns if the script must halt

export const scriptsMap: {
   [key: string]: TRunner;
} = {
   defend: aiDefendFromHostiles,
   harvest: aiGetEnergy,
   upgrade: aiUpgrade,
   build: aiBuild,
   repair: aiRepair,
   store: aiStoreEnergy,
   derp: aiDerp,
};

export const scripts = Object.keys(scriptsMap);

export type TScriptKey = keyof (typeof scriptsMap);

const creepStats: { [key: string]: string[] } = {};

export const resetStats = () => {
   scripts.forEach((key) => {
      creepStats[key] = [];
   });
};

export const getStats = () => creepStats;

export function creepAI(creep: ICreep, index: number, total: number) {
   for (const script of scripts) {
      if (scriptsMap[script](creep, index, total)) {
         creep.memory.activeScript = script;
         creepStats[script].push(creep.name);
         break;
      }
   }
}
