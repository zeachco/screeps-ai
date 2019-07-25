import { updateInventory } from './inventory';
import { clean, log } from './utils';
import { ICreep } from './enums';
import { roles } from './roles';
import { turretAI } from './role.turret';
import { resetStats, getStats } from './creepAI';

export function loop() {
   clean();
   resetStats();
   updateInventory();
   turretAI();

   let index = 0;
   for (var name in Game.creeps) {
      const creep = Game.creeps[name] as ICreep;
      const updateFn = roles[creep.memory.role];

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

   log(JSON.stringify(getStats(), null, 2));
   log('---');
}
