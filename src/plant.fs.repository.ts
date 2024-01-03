import * as path from "path";
import * as fs from "fs";
import { Plant } from "./Plant";
import { PlantRepository } from "./plant.repository";

export class FileSystemPlantRepository implements PlantRepository {
  save(plant: Plant): Promise<void> {
    return fs.promises.writeFile(
      path.join(__dirname, "plants.json"),
      JSON.stringify(plant)
    );
  }
}
