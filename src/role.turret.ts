import { findStructureAroundSpawn, log } from './utils';
import { ISpawn } from './types';

export function turretAI(spawn: ISpawn) {
   findStructureAroundSpawn(spawn, STRUCTURE_TOWER).forEach((tower) => {
      const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile) {
         if (tower.energy) {
            log(tower.id, 'attacking', closestHostile);
         } else {
            log(
               tower.id,
               'warning: cannot attack',
               closestHostile,
               'not enough energy'
            );
         }
         tower.attack(closestHostile);
         return;
      }

      // if not at war, it contributes
      const brokenUnits = tower.room.find(FIND_MY_STRUCTURES, {
         filter: (structure) => structure.hits < structure.hitsMax,
      });

      if (brokenUnits.length) {
         const randomBrokenUnit = brokenUnits[0];
         tower.repair(randomBrokenUnit);
      }
   });
}
