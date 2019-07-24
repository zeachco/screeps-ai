import { creepPresets } from './config';

export type TRole = keyof (typeof creepPresets);

export interface ICreep extends Creep {
   memory: {
      role: TRole;
      building: boolean;
      upgrading: boolean;
   };
}
