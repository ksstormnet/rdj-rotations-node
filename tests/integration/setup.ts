// tests/integration/setup.ts
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

afterAll(async () => {
  // Any cleanup needed
});

// No Prisma mocking here
