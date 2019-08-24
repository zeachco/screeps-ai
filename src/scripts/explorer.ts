import { ICreep, IRoleConfig } from '../types';
import { countCreepsByRole, ttl, moveToOptions, doesCreepCan } from '../utils';

const run = (creep: ICreep) => {
   // creep.moveTo(0, 18);

   const posInAnotherRoom = new RoomPosition(48, 22, 'E41N22');
   creep.moveTo(posInAnotherRoom, moveToOptions('#ff00ff'));
   // creep.moveTo();
   // creep.moveTo(
   //    creep.pos.findClosestByRange(
   //       creep.room.findExitTo(creep.memory.target || 'E41N22')
   //    )
   // );

   const otherCtrl = Game.getObjectById('5bbcaf5e9099fc012e63a80d');
   console.log(otherCtrl);

   // creep.moveByPath(creep.room.findPath(otherCtrl.pos));

   // console.log(creep.room.name, creep.pos.x);
   // if (
   //    creep.reserveController(creep.room.controller as StructureController) ===
   //    ERR_NOT_IN_RANGE
   //    // creep.upgradeController(creep.room.controller as StructureController) ===
   //    //    ERR_NOT_IN_RANGE
   // ) {
   //    creep.moveTo(
   //       creep.room.controller as StructureController,
   //       moveToOptions('#ff0000')
   //    );
   // }
};

export const ROLE_EXPLORE: IRoleConfig = {
   name: 'explore',
   run,
   shouldRun: ({ creep, creeps }) =>
      doesCreepCan(creep, [CLAIM]) &&
      countCreepsByRole(creeps, 'explore') < 1 &&
      creep.carry.energy > 200 &&
      ttl(creep) > 800,
   shouldStop: ({ creep, creeps }) =>
      countCreepsByRole(creeps, 'explore') > 1 || ttl(creep) < 500,
};
