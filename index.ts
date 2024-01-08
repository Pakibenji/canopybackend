#!/usr/bin/env node
import { Command } from "commander";
import {
  DateProvider,
  PostPlantCommand,
  PostPlantUseCase,
} from "./src/post-plant.usecase";
import { FileSystemPlantRepository } from "./src/plant.fs.repository";
import { ViewGardenUseCase } from "./src/view-garden.usecase";

class RealDateProvider implements DateProvider {
  getNow(): Date {
    return new Date();
  }
}

const plantRepository = new FileSystemPlantRepository();
const dateProvider = new RealDateProvider();
const postPlantUseCase = new PostPlantUseCase(plantRepository, dateProvider);
const viewGardenUseCase = new ViewGardenUseCase(plantRepository, dateProvider);
const program = new Command();

program
  .version("1.0.0")
  .description("Canopy")
  .addCommand(
    new Command("post")
      .argument("<user>", "the current user")
      .argument("<title>", "the title of the plant")
      .action(async (user, title) => {
        const postPlantCommand: PostPlantCommand = {
          id: `${Math.floor(Math.random() * 100000)}`,
          proprietary: user,
          title: title,
        };
        try {
          await postPlantUseCase.handle(postPlantCommand);
          console.log("plante postée");
          process.exit(0);
        } catch (error) {
          console.error("X", error);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command("view")
      .argument("<user>", "the user to view the timeline of")
      .action(async (user) => {
        try {
          const garden = await viewGardenUseCase.handle({ user });
          console.table(garden);
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
