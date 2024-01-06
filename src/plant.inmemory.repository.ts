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
    return Promise.resolve(
      [...this.plants.values()].filter((plant) => plant.proprietary === user)
    );
  }

  private _save(plant: Plant) {
    this.plants.set(plant.id, plant);
  }
}
