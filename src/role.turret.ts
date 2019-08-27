import { findStructureAroundSpawn, log } from './utils';
import { ISpawn, ICreep } from './types';
import { MIN_STRUCTURE_HITS, MAX_CREEPS } from './config';

export function turretAI(room: Room, creeps: ICreep[]) {
   findStructureAroundSpawn<StructureTower>(room, STRUCTURE_TOWER).forEach(
      (tower) => {
         const closestHostile = tower.pos.findClosestByRange(
            FIND_HOSTILE_CREEPS
         );
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

         if (tower.energy < 250) {
            return;
         }

         // if not at war, it contributes
         const repairTarget = tower.room
            .find(FIND_STRUCTURES, {
               filter: (structure) =>
                  structure.hits < structure.hitsMax &&
                  (structure.hits < MIN_STRUCTURE_HITS ||
                     creeps.length === MAX_CREEPS),
            })
            .sort((a, b) => {
               return a.hits - b.hits;
            });

         if (repairTarget.length) {
            const firstUnit = repairTarget[0];
            tower.repair(firstUnit);
         }
      }
   );
}
