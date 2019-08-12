import { clean } from './utils';
import { ISpawn } from './types';
import { manageSpawn } from './spawns';

export function loop () {
   console.log('test')
}

export default loop

clean();
Object.keys(Game.spawns).forEach((name) =>
   manageSpawn(Game.spawns[name] as ISpawn)
);
