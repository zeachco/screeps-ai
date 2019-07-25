import { harvestSourceBasedOfIndex, log } from './utils';
import { ICreep } from './enums';
import { energyStructureByOrder } from './config';

const qualifiesFor = (creep: ICreep, partsRequired: BodyPartConstant[]) =>
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
         if (qualifiesFor(creep, [atkType])) {
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

const aiGetEnergy = (creep: ICreep) => {
   if (creep.carry.energy === creep.carryCapacity) {
      return false;
   }

   if (creep.memory.activeScript !== 'harvest') {
      if (!creep.carry.energy) {
         creep.say(`🔄 harvest`);
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
   if (sources[0]) {
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
         creep.moveTo(sources[0], {
            visualizePathStyle: { stroke: '#ffaa00' },
         });
      }
      return true;
   }
   return false;
};

const aiStoreEnergy = (creep: ICreep) => {
   if (!creep.carry.energy) {
      return false;
   }
   const byPriority = (str: Structure) =>
      energyStructureByOrder.indexOf(str.structureType);

   const targets = creep.room
      .find(FIND_STRUCTURES, {
         filter: (str) =>
            energyStructureByOrder.indexOf(str.structureType) !== -1,
      })
      .sort((a, b) => byPriority(a) - byPriority(b));

   log(targets);

   if (targets.length) {
      if (creep.memory.activeScript !== 'store') {
         creep.say(`🔄 storing energy`);
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
   if (
      !creep.carry.energy ||
      getStats().upgrade.length >= getStats().store.length / 3
   ) {
      return false;
   }
   if (
      creep.upgradeController(creep.room.controller as StructureController) ===
      ERR_NOT_IN_RANGE
   ) {
      creep.moveTo(creep.room.controller as StructureController, {
         visualizePathStyle: { stroke: '#ffffff' },
      });
   }
   if (creep.memory.activeScript !== 'upgrade') {
      creep.say(`⬆️ upgrading room`);
   }
   return true;
};

const aiBuild = (creep: ICreep) => {
   if (
      !creep.carry.energy ||
      getStats().build.length >= getStats().upgrade.length
   ) {
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
         creep.say(`🔨 build ${closestSite.structureType}`);
      }

      if (creep.build(closestSite) === ERR_NOT_IN_RANGE) {
         creep.moveTo(closestSite);
      }
   }

   return !!closestSite;
};

const aiRepair = (creep: ICreep) => {
   if (
      !creep.carry.energy ||
      getStats().repair.length >= getStats().store.length
   ) {
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
   creep.say('I do not know what to do 🤪');
   return true;
};

type TRunner = (creep: ICreep) => boolean; // returns if the script must halt

export const scriptsMap: {
   [key: string]: TRunner;
} = {
   defend: aiDefendFromHostiles,
   harvest: aiGetEnergy,
   build: aiBuild,
   upgrade: aiUpgrade,
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

export function creepAI(creep: ICreep, index: number) {
   for (const script of scripts) {
      if (scriptsMap[script](creep)) {
         creep.memory.activeScript = script;
         creepStats[script].push(creep.name);
         break;
      }
   }
}
