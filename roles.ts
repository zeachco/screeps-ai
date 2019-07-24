import { builderAI } from './role.builder';
import { harvesterAI } from './role.harvester';
import { upgraderAI } from './role.upgrader';
import { fighterAI } from './role.fighter';

export const roles = {
   builder: builderAI,
   harvester: harvesterAI,
   upgrader: upgraderAI,
   fighter: fighterAI,
};
