import { builderAI } from './role.builder';
import { harvesterAI } from './role.harvester';
import { upgraderAI } from './role.upgrader';
import { creepAI } from './creepAI';

export const roles = {
   builder: builderAI,
   harvester: harvesterAI,
   upgrader: upgraderAI,
   polyrole: creepAI,
};
