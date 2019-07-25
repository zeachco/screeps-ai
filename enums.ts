import { TScriptKey } from './creepAI';

export interface ICreep extends Creep {
   memory: {
      building: boolean;
      upgrading: boolean;
      activeScript: TScriptKey;
   };
}
