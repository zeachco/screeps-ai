import { IRoleConfig } from '../types';

const run = () => {
   throw 'DO NOT RUN IDLE!';
};

export const ROLE_IDLE: IRoleConfig = {
   name: 'idle',
   priority: 0,
   run,
   shouldRun: () => true,
   shouldStop: () => false,
   updatePriority() {
      return -1;
   },
};
