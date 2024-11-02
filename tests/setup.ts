import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Create a deep mock of PrismaClient
const prismaMock = mockDeep<PrismaClient>({
  $on: jest.fn(), // Add the $on method we need
});

// Mock the PrismaClient constructor
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => prismaMock),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export { prismaMock };

// Type for mocked context
export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
};

// Helper to create mock context
export const createMockContext = (): MockContext => ({
  prisma: prismaMock,
});

// Global test setup
beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

// Global test teardown
afterAll(async () => {
  // Add any global cleanup here
});

// Custom matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});
