import {
   TRoleName,
   IRoom,
   IRoleInject as IRoleContext,
   ISpawn,
} from '../types';

export abstract class BaseRole {
   public priority: number;
   public name: TRoleName;
   constructor(name: TRoleName) {
      this.name = name;
      this.priority = 0;
   }
   abstract getPriority(room: IRoom): number;
   abstract run(ctx: IRoleContext): void;
   abstract shouldStart(ctx: IRoleContext): boolean;
   abstract shouldStop(ctx: IRoleContext): boolean;
   abstract getCreepBody(room: IRoom): void;
   abstract runnerNumber(room: IRoom): number;
   update(room: IRoom) {
      if (this.shouldSpawn(room)) {
         const spawns = room.find(FIND_MY_SPAWNS, {
            filter: (s) => !s.spawning,
         }) as ISpawn[];

         const span = spawns[0];
         if (span) {
            this.getCreepBody(room);
         }
      }
   }
   shouldSpawn(room: IRoom) {
      return room.memory.roles[this.name].length < this.runnerNumber(room);
   }
   onStart(ctx: IRoleContext) {
      ctx.creep.say(this.name);
   }
   onStop(ctx: IRoleContext) {
      ctx.creep.memory.role = 'idle';
   }
   updatePriority(room: IRoom) {
      this.priority = this.getPriority(room);
   }
   getRolesCount(room: IRoom, role = this.name) {
      return room.memory.roles[role].length;
   }
}
