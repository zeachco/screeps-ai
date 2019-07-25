import { updateInventory } from './inventory';
import { clean, log } from './utils';
import { ICreep } from './enums';
import { turretAI } from './role.turret';
import { resetStats, creepAI, getStats } from './creepAI';

export function loop() {
   clean();
   resetStats();
   updateInventory();
   turretAI();

   let index = 0;
   for (var name in Game.creeps) {
      const creep = Game.creeps[name] as ICreep;
      creepAI(creep, index);
   }

   // log(JSON.stringify(getStats(), null, 2));
}
