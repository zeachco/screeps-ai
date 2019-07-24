const WORK_T1 = [WORK, CARRY, MOVE];
const WORK_T2 = [WORK, WORK, CARRY, MOVE, MOVE];
const WORK_T3 = [WORK, WORK, WORK, CARRY, MOVE, MOVE];
const FAST_WORK_T1 = [WORK, CARRY, MOVE, MOVE];
const FAST_WORK_T2 = [WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE];
const FAST_WORK_T3 = [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
const FIGHTER_T1 = [ATTACK, RANGED_ATTACK, MOVE];
const ALL_USAGE_T1 = [MOVE, RANGED_ATTACK, WORK, CARRY, ATTACK, MOVE];

export const creepPresets = {
   harvester: {
      nb: 6,
      body: WORK_T1,
   },
   upgrader: {
      nb: 3,
      body: FAST_WORK_T2,
   },
   builder: {
      nb: 2,
      body: FAST_WORK_T3,
   },
   fighter: {
      nb: 4,
      body: ALL_USAGE_T1,
   },
};
