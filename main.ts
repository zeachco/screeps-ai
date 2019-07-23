import { updateInventory } from './inventory';
import { clean } from './utils';
import { ICreep } from './enums';
import { roles } from './roles';

export function loop() {
   clean();
   updateInventory();

   var tower = Game.getObjectById('f2bf874cdd0b4b9a8731ce9d') as StructureTower;

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
   } else {
   }

   let index = 0;
   for (var name in Game.creeps) {
      const creep = Game.creeps[name] as ICreep;
      const updateFn = roles[creep.memory.role];

      if (Math.random() > 0.8) {
         creep.say(`${creep.memory.role}`);
      }

      if (updateFn) {
         updateFn(creep, index++);
      } else {
         console.log(
            creep.name,
            'does not have a correct role: ',
            creep.memory.role
         );
         creep.suicide();
      }
   }
}
