import { scrapeProject } from "./src/scraper.js";
import { transformProject } from "./src/transformer.js";

const PROJECTS = ["SPARK", "HADOOP", "KAFKA"];

async function main() {
  for (let project of PROJECTS) {
    await scrapeProject(project);
    await transformProject(project);
  }
}

main();