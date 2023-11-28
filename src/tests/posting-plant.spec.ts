import {
  Plant,
  PostPlantUseCase,
  PostPlantCommand,
  PlantRepository,
  DateProvider,
} from "../post-plant.usecase";
describe("Feature: Posting a plant", () => {
  describe("Rule: A PlantTitle can contain a maximum of 30 characters", () => {
    test("User can post a plant on her timeline", () => {
      givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
      whenUserPostAPlant({
        id: "plantId",
        title: "Pachira",
        proprietary: "Alice",
      });

      thenPostedPlantShouldBe({
        id: "plantId",
        title: "Pachira",
        proprietary: "Alice",
        publishedAt: new Date("2023-01-19T19:00:00.000Z"),
      });
    });
  });
});

let plant: Plant;

class InMemoryPlantRepository implements PlantRepository {
  save(_plant: Plant): void {
    plant = _plant;
  }
}

class StubDateProvider implements DateProvider {
  now: Date;
  getNow(): Date {
    return this.now;
  }
}

const plantRepository = new InMemoryPlantRepository();
const dateProvider = new StubDateProvider();

const postPlantUseCase = new PostPlantUseCase(plantRepository, dateProvider);

function givenNowIs(_now: Date) {
  dateProvider.now = _now;
}

function whenUserPostAPlant(postPlantCommand: PostPlantCommand) {
  postPlantUseCase.handle(postPlantCommand);
}

function thenPostedPlantShouldBe(expectedPlant: Plant) {
  expect(expectedPlant).toEqual(plant);
}
