import { Plant, PlantRepository } from "./post-plant.usecase";

export class InMemoryPlantRepository implements PlantRepository {
  plant: Plant;
  save(_plant: Plant): void {
    this.plant = _plant;
  }
}
