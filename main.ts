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
   Object.keys(Game.creeps).forEach((key, index, all) => {
      creepAI(Game.creeps[key] as ICreep, index, all.length);
   });

   log(JSON.stringify(getStats(), null, 2));
   log('---');
}
