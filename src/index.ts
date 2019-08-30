import { manageRoom } from './room';

for (const name in Game.rooms) {
   const room = Game.rooms[name];
   manageRoom(room);
}
