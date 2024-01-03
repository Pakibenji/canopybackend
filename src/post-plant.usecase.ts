import { PlantRepository } from "./plant.repository";

export type PostPlantCommand = {
  id: string;
  title: string;
  proprietary: string;
};

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

  async handle(postPlantCommand: PostPlantCommand) {
    if (postPlantCommand.title.length > 30) {
      throw new TitleTooLongError();
    }
    if (postPlantCommand.title.trim().length === 0) {
      throw new EmptyTitleError();
    }
    await this.plantRepository.save({
      id: postPlantCommand.id,
      title: postPlantCommand.title,
      proprietary: postPlantCommand.proprietary,
      publishedAt: this.dateProvider.getNow(),
    });
  }
}
