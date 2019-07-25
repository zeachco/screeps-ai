const WORK_T1 = [WORK, CARRY, MOVE];
const ALL_USAGE_T1 = [RANGED_ATTACK, WORK, CARRY, ATTACK, MOVE];
const ALL_USAGE_T2 = [MOVE, RANGED_ATTACK, WORK, CARRY, ATTACK, MOVE];
const ALL_USAGE_T3 = [MOVE, RANGED_ATTACK, WORK, WORK, CARRY, ATTACK, MOVE];
const ALL_USAGE_T4 = [
   MOVE,
   MOVE,
   RANGED_ATTACK,
   WORK,
   WORK,
   CARRY,
   ATTACK,
   MOVE,
];

export const ALL_USAGE_ALL = [
   [WORK, CARRY, MOVE],
   [RANGED_ATTACK, WORK, CARRY, MOVE],
   [RANGED_ATTACK, WORK, WORK, CARRY, MOVE],
   [WORK, WORK, MOVE, MOVE, CARRY, MOVE],
   ALL_USAGE_T1,
   ALL_USAGE_T2,
   ALL_USAGE_T3,
   ALL_USAGE_T4,
];

export const energyStructureByOrder = [
   STRUCTURE_TOWER,
   STRUCTURE_SPAWN,
   STRUCTURE_EXTENSION,
   STRUCTURE_CONTAINER,
   STRUCTURE_POWER_BANK,
] as StructureConstant[];

export const creepPresets = {
   polyrole: {
      nb: 20,
      body: ALL_USAGE_ALL,
   },
};
