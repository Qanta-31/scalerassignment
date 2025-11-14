# 📘 Web Scraping Tutor Assignment — Apache Jira Scraper (Node.js)

This repository contains an **end-to-end data scraping and transformation pipeline** that fetches public issue data from **Apache’s Jira**, handles pagination and interruptions, saves raw structured JSON files, and converts them into a clean **JSONL dataset suitable for LLM training**.

The system is built using **Node.js (JavaScript)** and is designed to be:

- **Efficient**
- **Fault-tolerant**
- **Scalable**
- **Readable and maintainable**

---

# 🚀 Features

### ✅ Scrapes real issues from Apache’s public Jira instance
- You can choose any 2–3 projects (e.g., SPARK, HADOOP, KAFKA)
- Fetches:
  - Issue metadata (title, reporter, priority, labels, timestamps)
  - Description
  - All comments

### ✅ Pagination support  
Automatically retrieves issues in batches of 50.

### ✅ Graceful error handling
- Skips bad records  
- Handles empty/malformed data  
- Continues scraping even if comment fetching fails

### ✅ Auto-resume with checkpoints  
If the pipeline stops midway, it picks up from the last saved page.

### ✅ JSONL Dataset Creation  
Produces a training-ready dataset under:

```
data/jsonl/<project>.jsonl
```

Each JSONL object contains:
- Metadata (title, status, priority, reporter, timestamps)
- Description in plain text
- Processed comments

---

# 🏗 Project Structure

```
jira-scraper/
│
├── src/
│   ├── scraper.js         # Fetches issues + comments
│   ├── transformer.js     # Converts raw → JSONL
│
├── data/
│   ├── raw/               # Raw JSON files per issue
│   └── jsonl/             # Final transformed JSONL files
│
├── checkpoints/           # Saves resume state (startAt)
│
├── index.js               # Main runner
└── README.md
```

---

# ⚙️ Installation

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd jira-scraper
```

### 2. Install dependencies
```bash
npm install
```

---

# ▶️ How to Run

```bash
node index.js
```

The pipeline will:

1. Scrape issues for each project in `PROJECTS` from `index.js`  
2. Save raw issue+comment files under `data/raw/`  
3. Convert raw data to a clean JSONL dataset under `data/jsonl/`

---

# 🔍 Pipeline Overview

## 1. Data Scraping (scraper.js)

The scraper:

- Fetches issues from:
  
  ```
  https://issues.apache.org/jira/rest/api/2/search
  ```

- Fetches comments from:
  
  ```
  https://issues.apache.org/jira/rest/api/2/issue/<key>/comment
  ```

- Saves each issue to:
  
  ```
  data/raw/<PROJECT>_<ISSUEKEY>.json
  ```

### Handles:
- Pagination (`startAt`, `maxResults`)
- Missing fields (assignee, labels)
- Comment API failures
- Crashes (via checkpoints)

---

## 2. Data Transformation (transformer.js)

Transforms raw Jira data → JSONL:

Each JSONL entry contains:

```json
{
  "issue_key": "SPARK-12345",
  "title": "Fix incorrect SQL behavior",
  "project": "SPARK",
  "reporter": "John Doe",
  "assignee": "Jane Smith",
  "status": "Open",
  "priority": "Major",
  "labels": ["sql", "dataset"],
  "created": "2024-01-12",
  "updated": "2024-02-03",
  "description": "...",
  "comments": [
    {
      "author": "Alice",
      "body": "We faced the same issue.",
      "created": "2024-01-14"
    }
  ]
}
```

---

# 📈 Optimization Decisions

### ✔ Checkpoint System  
Prevents repeating work after interruptions.

### ✔ Layered Data Architecture  
Raw → Clean JSON → JSONL  
Allows re-transformation without re-scraping.

### ✔ JSONL Output  
Useful for:
- LLM fine-tuning  
- Summarization datasets  
- Classification  
- Semantic search  

---

# 📌 Edge Cases Handled

| Edge Case | Handling |
|----------|----------|
| API returns 0 issues | Stop pagination |
| Comments API fails | Continue without comments |
| Missing fields | Safe fallbacks |
| Script interrupts | Resume from last checkpoint |
| Malformed data | Skipped with guard checks |

---

# 🔒 Notes About Apache Jira

- Only **public** data is used  
- REST API scraping (not HTML scraping)  
- Rate limits respected (sequential calls)  

---

# 📤 Deliverables

- Full codebase
- Complete dataset pipeline (scraping + transformation)
- Documentation (this README)
- Architecture + design reasoning

---