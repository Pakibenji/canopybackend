import { Plant } from "./Plant";
import { PlantRepository } from "./plant.repository";

export class InMemoryPlantRepository implements PlantRepository {
  plants = new Map<string, Plant>();
  save(plant: Plant): Promise<void> {
    this._save(plant);
    return Promise.resolve();
  }
  getPlantById(plantId: string) {
    return this.plants.get(plantId);
  }
  givenExistingPlants(plants: Plant[]) {
    plants.forEach((plant) => this.plants.set(plant.id, plant));
  }
  getAllOfUser(user: string): Promise<Plant[]> {
    return Promise.resolve([
      {
        id: "plant-2",
        proprietary: "Karl Marx",
        title: "Ficus",
        publishedAt: new Date("2023-08-07T16:28:00.000Z"),
      },
      {
        id: "plant-1",
        proprietary: "Karl Marx",
        title: "Pachira",
        publishedAt: new Date("2023-08-07T16:27:00.000Z"),
      },
    ]);
  }

  private _save(plant: Plant) {
    this.plants.set(plant.id, plant);
  }
}
