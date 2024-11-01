import { PrismaClient } from "@prisma/client";
import { Logger } from "../utils/logger";

export class DatabaseService {
  private prisma: PrismaClient;
  private connected: boolean = false;
  private readonly logger: Logger;

  constructor() {
    this.prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
    this.logger = new Logger("DatabaseService");
  }

  async connect(): Promise<boolean> {
    try {
      // Test the connection by running a simple query
      await this.prisma.$queryRaw`SELECT 1`;
      this.connected = true;
      this.logger.info("Successfully connected to database");
      return true;
    } catch (error) {
      this.connected = false;
      this.logger.error("Failed to connect to database", error);
      throw new Error(
        `Database connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      this.connected = false;
      this.logger.info("Successfully disconnected from database");
    } catch (error) {
      this.logger.error("Error disconnecting from database", error);
      throw new Error(
        `Database disconnection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.connected) {
        return false;
      }
      // Test connection with a simple query
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error("Health check failed", error);
      return false;
    }
  }

  // Getter for the Prisma client - useful for other services that need direct database access
  getPrismaClient(): PrismaClient {
    if (!this.connected) {
      throw new Error("Database is not connected");
    }
    return this.prisma;
  }
}
