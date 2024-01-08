import { PlantRepository } from "./plant.repository";
import { DateProvider } from "./post-plant.usecase";

const ONE_MINUTE_IN_MILLISECONDS = 60000;
export class ViewGardenUseCase {
  constructor(
    private readonly plantRepository: PlantRepository,
    private readonly dateProvider: DateProvider
  ) {}
  async handle({ user }: { user: string }): Promise<
    {
      proprietary: string;
      title: string;
      publicationTime: string;
    }[]
  > {
    const plantsOfUser = (await this.plantRepository.getAllOfUser(user)).sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );
    return plantsOfUser.map((plant) => ({
      proprietary: plant.proprietary,
      title: plant.title,
      publicationTime: this.publicationTime(plant.publishedAt),
    }));
  }
  private publicationTime(publishedAt: Date) {
    const now = this.dateProvider.getNow();
    const diff = now.getTime() - publishedAt.getTime();
    const minutes = diff / ONE_MINUTE_IN_MILLISECONDS;
    if (minutes < 1) {
      return "Less than a minute ago";
    }
    if (minutes < 2) {
      return "1 minute ago";
    }
    return `${Math.floor(minutes)} minutes ago`;
  }
}
