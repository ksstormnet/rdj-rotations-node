import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset } from "jest-mock-extended";

// Load test environment variables
dotenv.config({ path: ".env.test" });

// Mock PrismaClient
export const mockPrismaClient = {
  $queryRaw: jest.fn(),
  $disconnect: jest.fn(),
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

// Create a mock instance of PrismaClient
const prismaMock = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(prismaMock);
});

export { prismaMock };

// Global test setup
beforeAll(() => {
  // Add any global setup here
  process.env.NODE_ENV = "test";
});

// Global test teardown
afterAll(async () => {
  // Add any global cleanup here
});

// Add custom matchers if needed
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
