import { DateProvider } from "./post-plant.usecase";

export class StubDateProvider implements DateProvider {
  now: Date;
  getNow(): Date {
    return this.now;
  }
}
