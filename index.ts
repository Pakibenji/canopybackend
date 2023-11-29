#!/usr/bin/env node
import { Command } from "commander";
import {
  DateProvider,
  PostPlantCommand,
  PostPlantUseCase,
} from "./src/post-plant.usecase";
import { InMemoryPlantRepository } from "./src/plant.inmemory.repository.ts";

class RealDateProvider implements DateProvider {
  getNow(): Date {
    return new Date();
  }
}

const plantRepository = new InMemoryPlantRepository();
const dateProvider = new RealDateProvider();
const postPlantUseCase = new PostPlantUseCase(plantRepository, dateProvider);

const program = new Command();

program
  .version("1.0.0")
  .description("Canopy")
  .addCommand(
    new Command("post")
      .argument("<user>", "the current user")
      .argument("<title>", "the title of the plant")
      .action((user, title) => {
        const postPlantCommand: PostPlantCommand = {
          id: "plantId",
          proprietary: user,
          title: title,
        };
        try {
          postPlantUseCase.handle(postPlantCommand);
          console.log("plante postée");
          console.table([plantRepository.plant]);
          process.exit(0);
        } catch (error) {
          console.error("X", error);
          process.exit(1);
        }
      })
  );

async function main() {
  await program.parseAsync();
}

main();
