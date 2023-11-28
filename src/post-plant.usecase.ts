export type Plant = {
  id: string;
  title: string;
  proprietary: string;
  publishedAt: Date;
};

export type PostPlantCommand = {
  id: string;
  title: string;
  proprietary: string;
};

export interface PlantRepository {
  save(plant: Plant): void;
}

export interface DateProvider {
  getNow(): Date;
}
export class PostPlantUseCase {
  constructor(
    private readonly plantRepository: PlantRepository,
    private readonly dateProvider: DateProvider
  ) {}

  handle(postPlantCommand: PostPlantCommand) {
    this.plantRepository.save({
      id: postPlantCommand.id,
      title: postPlantCommand.title,
      proprietary: postPlantCommand.proprietary,
      publishedAt: this.dateProvider.getNow(),
    });
  }
}
