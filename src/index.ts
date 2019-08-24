import { clean, moveToOptions } from './utils';
import { ISpawn, ICreep } from './types';
import { manageSpawn } from './spawns';

// export function loop() {
//    console.log('test');
// }

// const other = Game.getObjectById('5d613db142c42a63a0437aa5') as ICreep;
// other.moveTo(new RoomPosition(6, 21, Game.spawns.Spawn1.room.name));

// export default loop;

// const explorer = Game.getObjectById('5d613b0c09062063654d755a') as ICreep;
// explorer.moveTo(49, 26);

// const ctrl = explorer.room.controller as StructureController;

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

clean();
Object.keys(Game.spawns).forEach((name) =>
   manageSpawn(Game.spawns[name] as ISpawn)
);
