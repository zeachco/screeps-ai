import { log, findCreepByRole } from './utils';
import { TRole } from './enums';
import { creepPresets } from './config';

export function updateInventory() {
   (Object.keys(creepPresets) as TRole[]).forEach(role => {
      const creeps = findCreepByRole(role);
      const config = creepPresets[role];
      if (creeps.length < config.nb) {
         const newName = `${role}_${Game.time}`;
         Game.spawns['Spawn1'].spawnCreep(config.body, newName, {
            memory: { role },
         });
      } else if (creeps.length > config.nb) {
         creeps[0].suicide();
      }
   });
}
