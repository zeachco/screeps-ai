import { ROLE_UPGRADE } from './scripts/upgrade';
import { ROLE_STORE } from './scripts/store';
import { ROLE_BUILD } from './scripts/build';
import { ROLE_REPAIR } from './scripts/repair';
import { ROLE_HARVEST } from './scripts/harvest';
import { ROLE_IDLE } from './scripts/idle';
import { IRoleConfig, IRolesMap } from './types';
import { ROLE_CLAIM } from './scripts/claim';

export type TPowerStructures =
   | STRUCTURE_SPAWN
   | STRUCTURE_TOWER
   | STRUCTURE_EXTENSION
   | STRUCTURE_CONTAINER
   | STRUCTURE_POWER_BANK;

export const ENERGY_STRUCT_BY_NEEDS: TPowerStructures[] = [
   STRUCTURE_EXTENSION,
   STRUCTURE_TOWER,
   STRUCTURE_CONTAINER,
   STRUCTURE_POWER_BANK,
   STRUCTURE_SPAWN,
];

export const MIN_STRUCTURE_HITS = 1000000;
export const SHOW_ROLES = !true;
export const CREEPS_PER_TIERS = 1;
export const MIN_CREEPS = 3;
export const MAX_CREEPS = 5;

const r = (part: BodyPartConstant, count: number) => {
   const parts: BodyPartConstant[] = [];
   for (let i = 0; i < count; i++) {
      parts.push(part);
   }
   return parts;
};

export const rolesDispatch: IRoleConfig[] = [
   ROLE_CLAIM,
   ROLE_BUILD,
   ROLE_UPGRADE,
   ROLE_REPAIR,
   ROLE_STORE,
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

export const BODY_PARTS_PRESET: BodyPartConstant[] = [
   WORK,
   CARRY,
   MOVE,
   WORK,
   CARRY,
   MOVE,
   WORK,
   CARRY,
   MOVE,
   WORK,
   CARRY,
   MOVE,
   WORK,
   CARRY,
   MOVE,
   CARRY,
   MOVE,
   CARRY,
   MOVE,
   CARRY,
   CLAIM,
];
