import { ROLE_UPGRADE } from './scripts/upgrade';
import { ROLE_STORE } from './scripts/store';
import { ROLE_BUILD } from './scripts/build';
import { ROLE_REPAIR } from './scripts/repair';
import { ROLE_HARVEST } from './scripts/harvest';
import { ROLE_IDLE } from './scripts/idle';
import { IRoleConfig, IRolesMap } from './types';

type TPowerStructures =
   | STRUCTURE_SPAWN
   | STRUCTURE_TOWER
   | STRUCTURE_EXTENSION
   | STRUCTURE_CONTAINER
   | STRUCTURE_POWER_BANK;

export const energyStructureByOrder: TPowerStructures[] = [
   STRUCTURE_EXTENSION,
   STRUCTURE_TOWER,
   STRUCTURE_SPAWN,
   STRUCTURE_CONTAINER,
   STRUCTURE_POWER_BANK,
];

export const SHOW_ROLES = false;
export const CREEPS_PER_TIERS = 1;
export const MAX_CREEPS = 5;

const r = (part: BodyPartConstant, count: number) => {
   const parts: BodyPartConstant[] = [];
   for (let i = 0; i < count; i++) {
      parts.push(part);
   }
   return parts;
};

export const rolesDispatch: IRoleConfig[] = [
   ROLE_UPGRADE,
   ROLE_STORE,
   ROLE_BUILD,
   ROLE_REPAIR,
   ROLE_HARVEST,
   ROLE_IDLE,
];

export const ROLES: IRolesMap = rolesDispatch.reduce(
   (acc: IRolesMap, role: IRoleConfig) => {
      acc[role.name] = role;
      return acc;
   },
   {}
);
