import { creepPresets } from './config';
import { TScriptKey } from './creepAI';

export type TRole = keyof (typeof creepPresets);

export interface ICreep extends Creep {
   memory: {
      role: TRole;
      building: boolean;
      upgrading: boolean;
      activeScript: TScriptKey;
   };
}
