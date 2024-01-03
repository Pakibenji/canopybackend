import { Plant } from "./Plant";

export interface PlantRepository {
  save(plant: Plant): void;
  getAllOfUser(user: string): Promise<Plant[]>;
}
