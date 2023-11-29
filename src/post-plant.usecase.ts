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

export class TitleTooLongError extends Error {}

export class EmptyTitleError extends Error {}

export class PostPlantUseCase {
  constructor(
    private readonly plantRepository: PlantRepository,
    private readonly dateProvider: DateProvider
  ) {}

  handle(postPlantCommand: PostPlantCommand) {
    if (postPlantCommand.title.length > 30) {
      throw new TitleTooLongError();
    }
    if (postPlantCommand.title.trim().length === 0) {
      throw new EmptyTitleError();
    }
    this.plantRepository.save({
      id: postPlantCommand.id,
      title: postPlantCommand.title,
      proprietary: postPlantCommand.proprietary,
      publishedAt: this.dateProvider.getNow(),
    });
  }
}
