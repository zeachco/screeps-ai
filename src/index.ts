import { clean } from './utils';
// import { ISpawn } from './types';
// import { manageSpawn } from './spawns';
import { updateRoom } from './updates/room';

clean();

for (const name in Game.rooms) {
   const room = Game.rooms[name];
   updateRoom(room);
}

// Object.keys(Game.spawns).forEach((name) =>
//    manageSpawn(Game.spawns[name] as ISpawn)
// );
