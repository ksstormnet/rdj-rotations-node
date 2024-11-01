export const mockPrismaClient = {
  $queryRaw: jest.fn(),
  $disconnect: jest.fn(),
  $on: jest.fn(),
  $connect: jest.fn(),
};

export const prismaClientMock = jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));
