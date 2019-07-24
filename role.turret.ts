import { findStructureAroundSpawn, log } from './utils';

export function turretAI() {
   findStructureAroundSpawn('Spawn1', STRUCTURE_TOWER).forEach(tower => {
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
      const closestDamagedStructure = tower.pos.findClosestByRange(
         FIND_STRUCTURES,
         {
            filter: structure => structure.hits < structure.hitsMax,
         }
      );
      if (closestDamagedStructure) {
         tower.repair(closestDamagedStructure);
      }
   });
}
