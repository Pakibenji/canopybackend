import * as path from "path";
import * as fs from "fs";
import { Plant } from "./Plant";
import { PlantRepository } from "./plant.repository";

export class FileSystemPlantRepository implements PlantRepository {
  private readonly plantPath = path.join(__dirname, "plants.json");

  async save(plant: Plant): Promise<void> {
    const plants = await this.getPlants();
    plants.push(plant);
    return fs.promises.writeFile(
      path.join(__dirname, "plants.json"),
      JSON.stringify(plants)
    );
  }

  private async getPlants(): Promise<Plant[]> {
    const data = await fs.promises.readFile(this.plantPath);
    const plants = JSON.parse(data.toString()) as {
      id: string;
      proprietary: string;
      title: string;
      publishedAt: string;
    }[];
    return plants.map((plant) => ({
      id: plant.id,
      proprietary: plant.proprietary,
      title: plant.title,
      publishedAt: new Date(plant.publishedAt),
    }));
  }
  async getAllOfUser(user: string): Promise<Plant[]> {
    const plants = await this.getPlants();
    return plants.filter((plant) => plant.proprietary === user);
  }
}
