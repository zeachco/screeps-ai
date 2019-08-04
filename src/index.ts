import { clean } from './utils';
import { manageSpawn } from './inventory';
import { ISpawn } from './types';

clean();
Object.keys(Game.spawns).forEach((name) =>
   manageSpawn(Game.spawns[name] as ISpawn)
);
