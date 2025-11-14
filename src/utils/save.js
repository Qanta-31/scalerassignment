const fs = require('fs').promises;
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const RAW_DIR = path.join(ROOT, 'data', 'raw');
const JSONL_DIR = path.join(ROOT, 'data', 'jsonl');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function saveRaw(issueKey, content) {
  await ensureDir(RAW_DIR);
  const fp = path.join(RAW_DIR, `${issueKey}.json`);
  await fs.writeFile(fp, content, 'utf8');
}

async function appendJsonl(obj) {
  await ensureDir(JSONL_DIR);
  const fp = path.join(JSONL_DIR, 'issues.jsonl');
  await fs.appendFile(fp, JSON.stringify(obj) + '\n', 'utf8');
}

module.exports = { saveRaw, appendJsonl };
