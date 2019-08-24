import { getCreepUsedCargo, getCreepAvailableSpace } from './utils';
import { ICreep } from './types';

test('ok', () => {
   const creep = {
      carryCapacity: 100,
      carry: { energy: 20, GO: 20 },
   } as ICreep;

   expect(getCreepUsedCargo(creep)).toBe(40);
   expect(getCreepAvailableSpace(creep)).toBe(60);
});
