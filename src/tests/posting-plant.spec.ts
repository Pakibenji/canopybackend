import {
  PostPlantUseCase,
  PostPlantCommand,
  DateProvider,
  TitleTooLongError,
  EmptyTitleError,
} from "../post-plant.usecase";
import { Plant } from "../Plant";
import { InMemoryPlantRepository } from "../plant.inmemory.repository";
describe("Feature: Posting a plant", () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe("Rule: A PlantTitle can contain a maximum of 30 characters", () => {
    test("User can post a plant on her timeline", async () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
      await fixture.whenUserPostAPlant({
        id: "plantId",
        title: "Pachira",
        proprietary: "Alice",
      });

      fixture.thenPostedPlantShouldBe({
        id: "plantId",
        title: "Pachira",
        proprietary: "Alice",
        publishedAt: new Date("2023-01-19T19:00:00.000Z"),
      });
    });
    test("User cannot post a plant with a title longer than 30 characters", async () => {
      const titleWith31Characters = "A title with more than 30 characters";
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      await fixture.whenUserPostAPlant({
        id: "plantId",
        title: titleWith31Characters,
        proprietary: "Alice",
      });
      fixture.thenErrorShouldBe(TitleTooLongError);
    });
  });
  describe("Rule: A title cannot be blank", () => {
    test("User cannot post plant with empry Title", async () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
      await fixture.whenUserPostAPlant({
        id: "plantId",
        title: "",
        proprietary: "Alice",
      });
      fixture.thenErrorShouldBe(EmptyTitleError);
    });
    test("User cannot post a plant with an only whitespaces title", async () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
      await fixture.whenUserPostAPlant({
        id: "plantId",
        title: "   ",
        proprietary: "Alice",
      });
      fixture.thenErrorShouldBe(EmptyTitleError);
    });
  });
});

class StubDateProvider implements DateProvider {
  now: Date;
  getNow(): Date {
    return this.now;
  }
}

const createFixture = () => {
  const plantRepository = new InMemoryPlantRepository();
  const dateProvider = new StubDateProvider();
  const postPlantUseCase = new PostPlantUseCase(plantRepository, dateProvider);
  let thrownError: Error;
  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    async whenUserPostAPlant(postPlantCommand: PostPlantCommand) {
      try {
        await postPlantUseCase.handle(postPlantCommand);
      } catch (error) {
        thrownError = error;
      }
    },
    thenPostedPlantShouldBe(expectedPlant: Plant) {
      expect(expectedPlant).toEqual(
        plantRepository.getPlantById(expectedPlant.id)
      );
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
