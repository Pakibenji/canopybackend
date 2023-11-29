import {
  Plant,
  PostPlantUseCase,
  PostPlantCommand,
  DateProvider,
  TitleTooLongError,
  EmptyTitleError,
} from "../post-plant.usecase";
import { InMemoryPlantRepository } from "../plant.inmemory.repository.ts";
describe("Feature: Posting a plant", () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe("Rule: A PlantTitle can contain a maximum of 30 characters", () => {
    test("User can post a plant on her timeline", () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
      fixture.whenUserPostAPlant({
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
    test("User cannot post a plant with a title longer than 30 characters", () => {
      const titleWith31Characters = "A title with more than 30 characters";
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      fixture.whenUserPostAPlant({
        id: "plantId",
        title: titleWith31Characters,
        proprietary: "Alice",
      });
      fixture.thenErrorShouldBe(TitleTooLongError);
    });
  });
  describe("Rule: A title cannot be blank", () => {
    test("User cannot post plant with empry Title", () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
      fixture.whenUserPostAPlant({
        id: "plantId",
        title: "",
        proprietary: "Alice",
      });
      fixture.thenErrorShouldBe(EmptyTitleError);
    });
    test("User cannot post a plant with an only whitespaces title", () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
      fixture.whenUserPostAPlant({
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
    whenUserPostAPlant(postPlantCommand: PostPlantCommand) {
      try {
        postPlantUseCase.handle(postPlantCommand);
      } catch (error) {
        thrownError = error;
      }
    },
    thenPostedPlantShouldBe(expectedPlant: Plant) {
      expect(expectedPlant).toEqual(plantRepository.plant);
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
