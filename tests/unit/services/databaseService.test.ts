import { DatabaseService } from "../../../src/services/databaseService";
import { mockPrismaClient } from "../../setup";

describe("DatabaseService", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Setup default successful responses
    mockPrismaClient.$queryRaw.mockResolvedValue([{ "1": 1 }]);
    mockPrismaClient.$disconnect.mockResolvedValue(undefined);
  });

  describe("connection", () => {
    let dbService: DatabaseService;

    beforeEach(() => {
      dbService = new DatabaseService();
    });

    afterEach(async () => {
      await dbService.disconnect();
    });

    it("should connect to the database", async () => {
      const isConnected = await dbService.connect();

      expect(isConnected).toBe(true);
      expect(dbService.isConnected()).toBe(true);
      expect(mockPrismaClient.$queryRaw).toHaveBeenCalled();
    });

    it("should disconnect from the database", async () => {
      await dbService.connect();
      await dbService.disconnect();

      expect(dbService.isConnected()).toBe(false);
      expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
    });

    it("should handle connection errors gracefully", async () => {
      mockPrismaClient.$queryRaw.mockRejectedValueOnce(
        new Error("Connection failed"),
      );

      await expect(dbService.connect()).rejects.toThrow(
        "Database connection failed",
      );
      expect(dbService.isConnected()).toBe(false);
    });
  });

  describe("health check", () => {
    let dbService: DatabaseService;

    beforeEach(() => {
      dbService = new DatabaseService();
    });

    afterEach(async () => {
      await dbService.disconnect();
    });

    it("should return true when database is healthy", async () => {
      await dbService.connect();
      const isHealthy = await dbService.healthCheck();
      expect(isHealthy).toBe(true);
    });

    it("should return false when database is not connected", async () => {
      const isHealthy = await dbService.healthCheck();
      expect(isHealthy).toBe(false);
    });

    it("should return false when database query fails", async () => {
      await dbService.connect();
      mockPrismaClient.$queryRaw.mockRejectedValueOnce(
        new Error("Query failed"),
      );
      const isHealthy = await dbService.healthCheck();
      expect(isHealthy).toBe(false);
    });
  });
});
