import { updateInventory } from './inventory';
import { clean } from './utils';
import { ICreep } from './enums';
import { roles } from './roles';
import { turretAI } from './role.turret';

export function loop() {
   clean();
   updateInventory();
   turretAI();

   let index = 0;
   for (var name in Game.creeps) {
      const creep = Game.creeps[name] as ICreep;
      const updateFn = roles[creep.memory.role];

      if (Math.random() > 0.9) {
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
