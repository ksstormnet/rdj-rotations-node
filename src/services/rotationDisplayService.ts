import { RotationRepository } from '../repositories/rotationRepository';
import { DatabaseService } from './databaseService';

export class RotationDisplayService {
  private rotationRepo: RotationRepository;
  private dbService: DatabaseService;

  constructor(dbService: DatabaseService) {
    // Modified to accept dbService
    this.dbService = dbService;
    this.rotationRepo = new RotationRepository(dbService);
  }

  async displayRotation(name: string): Promise<void> {
    try {
      const rotation = await this.rotationRepo.getRotationByName(name);
      if (!rotation) {
        console.log(`Rotation "${name}" not found`);
        return;
      }

      const items = await this.rotationRepo.getRotationItems(rotation.ID);

      console.log(`\nRotation: ${rotation.name}`);
      console.log('----------------------------------------');
      console.log('Ord | Category | Subcategory | Data');
      console.log('----------------------------------------');

      items.forEach((item) => {
        console.log(
          `${item.ord.toString().padStart(3, ' ')} | ` +
            `${item.catID.toString().padStart(8, ' ')} | ` +
            `${item.subID.toString().padStart(10, ' ')} | ` +
            `${item.data}`
        );
      });
    } catch (error) {
      console.error('Error displaying rotation:', error);
      throw error; // Re-throw for test to catch
    }
  }
}
