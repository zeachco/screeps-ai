export function turretAI() {
   const tower = Game.getObjectById(
      '5d37a055e9ffb93fbdf89a6a'
   ) as StructureTower;

   if (tower) {
      var closestDamagedStructure = tower.pos.findClosestByRange(
         FIND_STRUCTURES,
         {
            filter: structure => structure.hits < structure.hitsMax,
         }
      );
      if (closestDamagedStructure) {
         tower.repair(closestDamagedStructure);
      }

      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile) {
         tower.attack(closestHostile);
      }
   }
}
