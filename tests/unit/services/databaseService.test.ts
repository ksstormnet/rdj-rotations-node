import { DatabaseService } from '../../../src/services/databaseService';
import { createMockContext, MockContext, prismaMock } from '../../setup';

describe('DatabaseService', () => {
  let mockCtx: MockContext;
  let dbService: DatabaseService;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    mockCtx = createMockContext();
    dbService = new DatabaseService();
    // Inject our mock
    (dbService as any).prisma = mockCtx.prisma;

    // Setup default successful responses
    mockCtx.prisma.$queryRaw.mockResolvedValue([{ '1': 1 }]);
    mockCtx.prisma.$disconnect.mockResolvedValue(undefined);
  });

  describe('connection', () => {
    afterEach(async () => {
      await dbService.disconnect();
    });

    it('should connect to the database', async () => {
      const isConnected = await dbService.connect();
      expect(isConnected).toBe(true);
      expect(dbService.isConnected()).toBe(true);
      expect(mockCtx.prisma.$queryRaw).toHaveBeenCalled();
    });

    it('should disconnect from the database', async () => {
      await dbService.connect();
      await dbService.disconnect();
      expect(dbService.isConnected()).toBe(false);
      expect(mockCtx.prisma.$disconnect).toHaveBeenCalled();
    });

    it('should handle connection errors gracefully', async () => {
      mockCtx.prisma.$queryRaw.mockRejectedValueOnce(
        new Error('Connection failed')
      );
      await expect(dbService.connect()).rejects.toThrow(
        'Database connection failed'
      );
      expect(dbService.isConnected()).toBe(false);
    });
  });

  describe('health check', () => {
    afterEach(async () => {
      await dbService.disconnect();
    });

    it('should return true when database is healthy', async () => {
      await dbService.connect();
      const isHealthy = await dbService.healthCheck();
      expect(isHealthy).toBe(true);
    });

    it('should return false when database is not connected', async () => {
      const isHealthy = await dbService.healthCheck();
      expect(isHealthy).toBe(false);
    });

    it('should return false when database query fails', async () => {
      await dbService.connect();
      mockCtx.prisma.$queryRaw.mockRejectedValueOnce(new Error('Query failed'));
      const isHealthy = await dbService.healthCheck();
      expect(isHealthy).toBe(false);
    });
  });
});
