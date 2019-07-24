const WORK_T1 = [WORK, CARRY, MOVE];
const WORK_T2 = [WORK, WORK, CARRY, MOVE, MOVE];
const WORK_T3 = [WORK, WORK, WORK, CARRY, MOVE, MOVE];
const FAST_WORK_T1 = [WORK, CARRY, MOVE, MOVE];
const FAST_WORK_T2 = [WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE];
const FAST_WORK_T3 = [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
const FIGHTER_T1 = [ATTACK, ATTACK, MOVE, MOVE];

export const creepPresets = {
   harvester: {
      nb: 3,
      body: FAST_WORK_T1,
   },
   upgrader: {
      nb: 3,
      body: FAST_WORK_T2,
   },
   builder: {
      nb: 3,
      body: FAST_WORK_T3,
   },
   fighter: {
      nb: 5,
      body: FIGHTER_T1,
   },
};
