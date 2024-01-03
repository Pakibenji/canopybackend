import { InMemoryPlantRepository } from "../plant.inmemory.repository";
import { Plant } from "../Plant";
import { ViewGardenUseCase } from "../view-garden.usecase";
describe("Feature: Viewing a personnal plant list", () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });
  describe("Rule: Plants are shown in reverse chronological order", () => {
    xtest("User can view the 2 plants he published in her garden"),
      async () => {
        fixture.givenTheFollowingPlantsExists([
          {
            id: "plant-1",
            proprietary: "Karl Marx",
            title: "Pachira",
            publishedAt: new Date("2023-08-07T16:27:00.000Z"),
          },
          {
            id: "plant-2",
            proprietary: "Karl Marx",
            title: "Ficus",
            publishedAt: new Date("2023-08-07T16:28:00.000Z"),
          },
          {
            id: "plant-3",
            proprietary: "Lenine",
            title: "Ficus",
            publishedAt: new Date("2023-05-07T16:28:00.000Z"),
          },
        ]);
        fixture.givenNowIs(new Date("2023-08-07T16:29:00.000Z"));

        await fixture.whenUserSeesThegardenOf("Karl Marx");

        fixture.thenUserShouldSee([
          {
            proprietary: "Karl Marx",
            title: "Ficus",
            publicationTime: "1 minute ago",
          },
          {
            proprietary: "Karl Marx",
            title: "Pachira",
            publicationTime: "2 minute ago",
          },
        ]);
      };
  });
});

const createFixture = () => {
  let garden: {
    proprietary: string;
    title: string;
    publicationTime: string;
  }[];
  const plantRepository = new InMemoryPlantRepository();
  const viewGardenUseCase = new ViewGardenUseCase(plantRepository);
  return {
    givenTheFollowingPlantsExists(plants: Plant[]) {
      plantRepository.givenExistingPlants(plants);
    },
    givenNowIs(now: Date) {},
    async whenUserSeesThegardenOf(user: string) {
      garden = await viewGardenUseCase.handle({ user });
    },
    thenUserShouldSee(
      expectedgarden: {
        proprietary: string;
        title: string;
        publicationTime: string;
      }[]
    ) {
      expect(garden).toEqual(expectedgarden);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
