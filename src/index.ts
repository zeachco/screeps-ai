import { clean } from './utils';
import { ISpawn } from './types';
import { manageSpawn } from './spawns';

clean();
Object.keys(Game.spawns).forEach((name) =>
   manageSpawn(Game.spawns[name] as ISpawn)
);
