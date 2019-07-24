import { log, findCreepByRole } from './utils';
import { TRole } from './enums';
import { creepPresets } from './config';

export function updateInventory() {
   // const specs: any = {};
   (Object.keys(creepPresets) as TRole[]).forEach(role => {
      const creeps = findCreepByRole(role);
      const config = creepPresets[role];
      // log(`Checking for ${role} (${creeps.length}/${config.nb})`);
      if (creeps.length < config.nb) {
         const newName = `${role}_${Game.time}`;
         // specs[role] = `${creeps.length}/${config.nb}: ${config.body.join(
         //    ', '
         // )}`;
         Game.spawns['Spawn1'].spawnCreep(config.body, newName, {
            memory: { role },
         });
      } else if (creeps.length > config.nb) {
         creeps[0].suicide();
      }
   });
   // log(JSON.stringify(specs, null, 2));
}
