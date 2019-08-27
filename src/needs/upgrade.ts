import { BaseRole } from './base';
import { IRunnerInjections, IRoleInject, IRoom } from '../types';
import { getCreepAvailableSpace, moveToOptions, getObjects } from '../utils';
import { findBestEnergySource } from '../scripts/harvest';

export class StoreRole extends BaseRole {
   getPriority(room: IRoom) {
      let score = 0;
      if (room.energyAvailable < room.energyCapacityAvailable) {
         score += 10;
      }
      if (room.energyAvailable < 300) {
         score += 10;
      }
      const sources = getObjects<Source>(room.memory.energySources);
      const availableEnergy = sources.reduce(
         (acc, source) => acc + source.energy,
         0
      );
      if (availableEnergy > 1000) {
         score += 10;
      } else {
         score -= 10;
      }
      return score;
   }

   run({ creep }: IRoleInject) {
      if (typeof creep.ticksToLive === 'number' && creep.ticksToLive < 75) {
         if (creep.carry.energy === 0) {
            creep.suicide();
         } else {
            creep.memory.role = 'idle';
         }
      }
      // first pick decaying resources
      const targets = creep.room.find(FIND_DROPPED_RESOURCES);
      if (targets.length) {
         if (creep.pickup(targets[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], moveToOptions('#ffff00'));
         }
         return;
      }

      // then get the reserves
      const sources = creep.room.find(FIND_SOURCES, {
         filter: (s) => s && s.energy > 0,
      });
      const selectIndex = creep.memory.targetSourceIndex;

      if (!sources.length) {
         creep.memory.role = 'idle';
         return;
      }

      if (sources[selectIndex].energy === 0) {
         findBestEnergySource(creep);
      }

      if (sources[selectIndex]) {
         if (creep.harvest(sources[selectIndex]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[selectIndex], moveToOptions('#ffff00'));
         }
      }
   }

   shouldStart({ room, creep }: IRunnerInjections) {
      const canCarry = getCreepAvailableSpace(creep) > 50;
      return canCarry && this.getRolesCount(room) < 1;
   }

   shouldStop() {
      return false;
   }
}
