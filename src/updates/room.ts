import { prepareMemory } from '../utils';
import { IRoom, DEFAULT_ROOM_MEMORY } from '../types';
import { BaseRole } from '../needs/base';
import { HarvestRole } from '../needs/harvest';
import { StoreRole } from '../needs/store';

const NEEDS: BaseRole[] = [new HarvestRole('harvest'), new StoreRole('store')];

export function updateRoom(gameRoom: Room) {
   gameRoom.memory = {};
   const room = prepareMemory<IRoom>(gameRoom, DEFAULT_ROOM_MEMORY);
   console.log(`Updating ${room.name} `, JSON.stringify(room.memory));
   NEEDS.forEach((n) => n.updatePriority(room));
   const needs = NEEDS.sort((a, b) => b.priority - a.priority);

   room.visual.text(
      `needs: ${needs.map((n) => `${n.priority} ${n.name}`).join(', ')}`,
      0,
      0,
      {
         align: 'left',
      }
   );

   let posy = 1;
   for (const role in room.memory.roles) {
      room.visual.text(
         `${role}: ${room.memory.roles[role].length}`,
         0,
         posy++,
         {
            align: 'left',
         }
      );
   }
}
