import { DatabaseService } from "./services/databaseService";
import { RotationDisplayService } from "./services/rotationDisplayService";

async function main() {
  const dbService = new DatabaseService();
  await dbService.connect();

  try {
    const display = new RotationDisplayService(dbService);
    await display.displayRotation("Hr A");
  } finally {
    await dbService.disconnect();
  }
}

if (require.main === module) {
  main().catch(console.error);
}
