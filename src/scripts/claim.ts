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

// export function loop() {
//    console.log('test');
// }

// const other = Game.getObjectById('5d613db142c42a63a0437aa5') as ICreep;
// other.moveTo(new RoomPosition(6, 21, Game.spawns.Spawn1.room.name));

// export default loop;

// const explorer = Game.getObjectById('5d613b0c09062063654d755a') as ICreep;
// // explorer.moveTo(49, 26);

// const ctrl = explorer.room.controller as StructureController;
// ctrl.room.memory

// if (!ctrl.owner) {
//    const doReserve = explorer.reserveController(explorer.room
//       .controller as StructureController);

//    console.log('reserve', doReserve);

//    if (doReserve === ERR_NOT_IN_RANGE) {
//       explorer.moveTo(
//          explorer.room.controller as StructureController,
//          moveToOptions('#ff0000')
//       );
//    }
// }

export const ROLE_CLAIM: IRoleConfig = {
   name: 'claim',
   priority: 0,
   run,
   shouldRun({ creep, creeps }) {
      return (
         doesCreepCan(creep, [CLAIM]) &&
         countCreepsByRole(creeps, 'claim') < 1 &&
         creep.carry.energy > 200 &&
         ttl(creep) > 800
      );
   },
   shouldStop({ creep, creeps }) {
      return countCreepsByRole(creeps, 'claim') > 1 || ttl(creep) < 500;
   },
   onStart({ creep, room }) {
      // TODO create path to next room
   },
   updatePriority() {
      return 0;
   },
};
