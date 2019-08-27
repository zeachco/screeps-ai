import { clean } from './utils';
import { manageRoom } from './spawns';

clean();

for (const name in Game.rooms) {
   const room = Game.rooms[name];
   manageRoom(room);
}
