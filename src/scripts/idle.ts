import { IRoleConfig } from '../types';

const run = () => {
   throw 'DO NOT RUN IDLE!';
};

export const ROLE_IDLE: IRoleConfig = {
   name: 'idle',
   run,
   shouldRun: () => true,
   shouldStop: () => false,
};
