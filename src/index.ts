import { clean } from './utils';
import { IRoom } from './types';
import { manageRoom } from './spawns';

clean();

for (const name in Game.rooms) {
   const room = Game.rooms[name] as IRoom;
   manageRoom(room);
}
