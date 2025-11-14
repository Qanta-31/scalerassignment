import fs from "fs-extra";
import jsonlines from "jsonlines";

export function transformProject(project) {
  const writer = jsonlines.stringify();
  fs.ensureDirSync("data/jsonl");

  const output = fs.createWriteStream(`data/jsonl/${project}.jsonl`);
  writer.pipe(output);

  const files = fs.readdirSync("data/raw");

  for (let file of files) {
    if (!file.startsWith(project)) continue;

    const raw = fs.readJsonSync(`data/raw/${file}`);
    const fields = raw.fields;

    const item = {
      issue_key: raw.key,
      title: fields.summary,
      project,
      reporter: fields.reporter?.displayName,
      assignee: fields.assignee?.displayName,
      status: fields.status?.name,
      priority: fields.priority?.name,
      labels: fields.labels || [],
      created: fields.created,
      updated: fields.updated,
      description: fields.description || "",
      comments: raw.comments.map(c => ({
        author: c.author.displayName,
        body: c.body,
        created: c.created
      }))
    };

    writer.write(item);
  }

  writer.end();
  console.log(`JSONL created: data/jsonl/${project}.jsonl`);
}
