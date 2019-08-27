import {
   getCreepUsedCargo,
   getCreepAvailableSpace,
   doesCreepCan,
   energySourceQualifiesForCreep,
} from './utils';
import { ICreep } from './types';

test('getCreepUsedCargo', () => {
   const creep = {
      carryCapacity: 100,
      carry: { energy: 20, GO: 20 },
   } as ICreep;

   expect(getCreepUsedCargo(creep)).toBe(40);
   expect(getCreepAvailableSpace(creep)).toBe(60);
});

test('energySourceQualifiesForCreep', () => {
   const spawn: StructurePowerSpawn = {
      energy: 1000,
   } as any;

   const smallCreep: ICreep = {
      carryCapacity: 350,
      carry: { energy: 0 },
   } as any;

   const largeCreep: ICreep = {
      carryCapacity: 1350,
      carry: { energy: 0 },
   } as any;

   const largeCreepWithNoRoom: ICreep = {
      carryCapacity: 1350,
      carry: { energy: 1250 },
   } as any;

   expect(energySourceQualifiesForCreep(spawn, smallCreep)).toBe(true);
   expect(energySourceQualifiesForCreep(spawn, largeCreep)).toBe(false);
   expect(energySourceQualifiesForCreep(spawn, largeCreepWithNoRoom)).toBe(
      true
   );
});

test('doesCreepCan', () => {
   const creep: ICreep = {
      body: [
         {
            type: 'attack',
            hits: 100,
         },
      ],
   } as any;
   expect(doesCreepCan(creep, ['attack'])).toBe(true);
   expect(doesCreepCan(creep, ['work'])).toBe(false);
});
