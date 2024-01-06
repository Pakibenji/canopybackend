import { PlantRepository } from "./plant.repository";

export class ViewGardenUseCase {
  constructor(private readonly plantRepository: PlantRepository) {}
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
    return [
      {
        proprietary: plantsOfUser[0].proprietary,
        title: plantsOfUser[0].title,
        publicationTime: "1 minute ago",
      },
      {
        proprietary: plantsOfUser[1].proprietary,
        title: plantsOfUser[1].title,
        publicationTime: "2 minute ago",
      },
    ];
  }
}
