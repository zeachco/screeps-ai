import { ICreep, IRoleConfig } from '../types';
import { countCreepsByRole, moveToOptions } from '../utils';

const run = (creep: ICreep) => {
   if (
      creep.upgradeController(creep.room.controller as StructureController) ===
      ERR_NOT_IN_RANGE
   ) {
      creep.moveTo(
         creep.room.controller as StructureController,
         moveToOptions('#ff0000')
      );
   }
};

export const ROLE_UPGRADE: IRoleConfig = {
   name: 'upgrade',
   priority: 0,
   run,
   shouldRun({ creep, creeps }) {
      return (
         countCreepsByRole(creeps, 'upgrade') < creeps.length / 4 &&
         creep.carry.energy > 0
      );
   },
   shouldStop({ creep }) {
      return creep.carry.energy === 0;
   },
   updatePriority(room) {
      const ctrl = room.controller as StructureController;
      if (ctrl.level >= 8 || ctrl.upgradeBlocked) {
         return 1;
      }
      const need = ctrl.ticksToDowngrade / ctrl.level < 5000 ? 200 : 1;
      return need / (Object.keys(room.memory.roles.upgrade).length || 1);
   },
};
