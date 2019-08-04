import { ICreep } from '../types';
import { log, doesCreepCan, moveToOptions } from '../utils';

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
               creep.moveTo(closestHostile, moveToOptions('#ff0000'));
            }
            return true;
         }
         return false;
      };

      return atemptAtk(RANGED_ATTACK) || atemptAtk(ATTACK);
   }
   return false;
};
