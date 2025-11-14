import axios from "axios";
import fs from "fs-extra";

const API = "https://issues.apache.org/jira/rest/api/2";
const PAGE_SIZE = 50;

async function fetchIssues(project, startAt = 0) {
  const url = `${API}/search?jql=project=${project}&startAt=${startAt}&maxResults=${PAGE_SIZE}`;
  const res = await axios.get(url, { timeout: 10000 });
  return res.data;
}

async function fetchComments(issueKey) {
  const url = `${API}/issue/${issueKey}/comment`;
  try {
    const res = await axios.get(url);
    return res.data.comments || [];
  } catch (err) {
    return [];
  }
}

function loadCheckpoint(project) {
  fs.ensureDirSync("checkpoints");
  try {
    return JSON.parse(fs.readFileSync(`checkpoints/${project}.json`));
  } catch {
    return { startAt: 0 };
  }
}

function saveCheckpoint(project, checkpoint) {
  fs.ensureDirSync("checkpoints");
  fs.writeFileSync(`checkpoints/${project}.json`, JSON.stringify(checkpoint, null, 2));
}

export async function scrapeProject(project) {
  fs.ensureDirSync("data/raw");

  let { startAt } = loadCheckpoint(project);
  console.log(`Resuming ${project} at ${startAt}`);

  while (true) {
    const data = await fetchIssues(project, startAt);

    if (!data.issues.length) break;

    for (let issue of data.issues) {
      const comments = await fetchComments(issue.key);

      fs.writeJsonSync(
        `data/raw/${project}_${issue.key}.json`,
        { ...issue, comments },
        { spaces: 2 }
      );
    }

    startAt += PAGE_SIZE;
    saveCheckpoint(project, { startAt });
    console.log(`Fetched up to ${startAt} issues`);
  }

  console.log(`Finished scraping ${project}`);
}
