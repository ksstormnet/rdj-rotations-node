import { PrismaClient } from "@prisma/client";
import { Rotation } from "../models/rotation";
import { RotationList } from "../models/rotationList";
import { DatabaseService } from "../services/databaseService";

export class RotationRepository {
  private dbService: DatabaseService;

  constructor(dbService: DatabaseService) {
    this.dbService = dbService;
  }

  private get prisma(): PrismaClient {
    return this.dbService.getPrismaClient();
  }

  async getRotationByName(name: string): Promise<Rotation | null> {
    console.log("Fetching rotation:", name); // Debug log
    console.log("Prisma client:", this.prisma); // Debug log

    try {
      const rotationData = await this.prisma.rotations.findFirst({
        where: { name },
      });

      console.log("Rotation data:", rotationData); // Debug log

      if (!rotationData) return null;

      return new Rotation({
        ID: rotationData.ID,
        name: rotationData.name,
      });
    } catch (error) {
      console.error("Error fetching rotation:", error);
      throw error;
    }
  }

  async getRotationItems(rotationId: number): Promise<RotationList[]> {
    try {
      const items = await this.prisma.rotations_list.findMany({
        where: { pID: rotationId },
        orderBy: { ord: "asc" },
      });

      return items.map(
        (item) =>
          new RotationList({
            ...item,
            ID: item.ID,
            pID: item.pID,
            catID: item.catID,
            subID: item.subID,
            genID: item.genID,
            ord: item.ord,
            data: item.data,
            repeatRule: item.repeatRule,
            selType: item.selType,
            sweeper: item.sweeper,
            track_separation: item.track_separation,
            artist_separation: item.artist_separation,
            title_separation: item.title_separation,
            album_separation: item.album_separation,
          }),
      );
    } catch (error) {
      console.error("Error fetching rotation items:", error);
      throw error;
    }
  }
}
