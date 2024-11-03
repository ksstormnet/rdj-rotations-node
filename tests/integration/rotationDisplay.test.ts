// tests/integration/rotationDisplay.test.ts
import { DatabaseService } from '../../src/services/databaseService';
import { RotationRepository } from '../../src/repositories/rotationRepository';
import { RotationDisplayService } from '../../src/services/rotationDisplayService';

jest.unmock('@prisma/client');

describe('Rotation Display Integration', () => {
  let dbService: DatabaseService;
  let rotationRepo: RotationRepository;
  let displayService: RotationDisplayService;

  beforeAll(async () => {
    dbService = new DatabaseService();
    await dbService.connect();
    rotationRepo = new RotationRepository(dbService);
    displayService = new RotationDisplayService(dbService);
  });

  afterAll(async () => {
    await dbService.disconnect();
  });

  it('should fetch rotation Hr A with items', async () => {
    const rotation = await rotationRepo.getRotationByName('Hr A');
    expect(rotation).not.toBeNull();
    expect(rotation?.name).toBe('Hr A');

    if (rotation) {
      const items = await rotationRepo.getRotationItems(rotation.ID);

      if (process.env.DEBUG) {
        console.log('\nRotation Hr A Structure:');
        console.log('-----------------------');
        items.forEach((item) => {
          console.log(
            `${item.ord}: Category ${item.catID}, Subcategory ${item.subID} - ${item.data}`
          );
        });
      }

      expect(items.length).toBeGreaterThan(0);
      expect(items[0].ord).toBe(0);

      for (let i = 1; i < items.length; i++) {
        expect(items[i].ord).toBeGreaterThan(items[i - 1].ord);
      }
    }
  });

  it('should handle non-existent rotation name', async () => {
    const rotation = await rotationRepo.getRotationByName('Hr X');
    expect(rotation).toBeNull();
  });

  it('should find all rotation hours A through F', async () => {
    const hourNames = ['Hr A', 'Hr B', 'Hr C', 'Hr D', 'Hr E', 'Hr F'];

    for (const name of hourNames) {
      const rotation = await rotationRepo.getRotationByName(name);
      expect(rotation).not.toBeNull();
      expect(rotation?.name).toBe(name);
    }
  });

  it('should have a consistent number of items in each rotation', async () => {
    const hourNames = ['Hr A', 'Hr B', 'Hr C', 'Hr D', 'Hr E', 'Hr F'];
    const itemCounts = new Map<string, number>();

    for (const name of hourNames) {
      const rotation = await rotationRepo.getRotationByName(name);
      if (rotation) {
        const items = await rotationRepo.getRotationItems(rotation.ID);
        itemCounts.set(name, items.length);
      }
    }

    // Each hour should have items
    for (const [name, count] of itemCounts) {
      expect(count).toBeGreaterThan(0);
      if (process.env.DEBUG) {
        console.log(`${name}: ${count} items`);
      }
    }
  });
});
