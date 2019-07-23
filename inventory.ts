import { log, findCreepByRole } from './utils';
import { creepPresets, TRole } from './enums';

export function updateInventory() {
   Object.keys(creepPresets).forEach((role: TRole) => {
      const creeps = findCreepByRole(role);

      const config = creepPresets[role];
      log(`Checking for ${role} (${creeps.length}/${config.nb})`);
      if (creeps.length < config.nb) {
         const newName = `${role}_${Game.time}`;
         log(`Spawning new ${role}: ${newName} (${config.body.join(', ')})`);
         Game.spawns['Spawn1'].spawnCreep(config.body, newName, {
            memory: { role },
         });
      } else if (creeps.length > config.nb) {
         creeps[0].suicide();
      }
   });
}
