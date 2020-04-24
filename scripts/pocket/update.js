#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {execFile} = require('child_process');
const SQL = require('sql-template-strings');

const db = require('./db');
const console = require('./log');

const DIR = path.resolve('./');

function createAuthFile() {
  const auth = `
consumer_key = "${process.env.POCKET_CONSUMER}"
access_token = "${process.env.POCKET_TOKEN}"
  `;

  fs.writeFileSync(`${DIR}/secrets.py`, JSON.stringify(auth));
}

async function runPythonScript() {
  return new Promise((resolve, reject) => {
    const subProc = execFile(
      `${DIR}/pockexport/export.py`,
      [
        `--consumer_key=${process.env.POCKET_CONSUMER}`,
        `--access_token=${process.env.POCKET_TOKEN}`,
        `${DIR}/output.json`,
      ],
      function(err, stdout, stderr) {
        if (err) {
          console.error(err);
          return reject();
        }

        return resolve();
      },
    );
  });
}

async function insertRecords(string, db) {
  const data = JSON.parse(string);
  const records = Object.values(data.list);
  let query;
  for (let i = 0; i < records.length; i++) {
    const first = i === 0;
    const last = i === records.length;
    const {
      resolved_title,
      resolved_url,
      time_added,
      excerpt,
      word_count,
    } = records[i];

    const date_updated = new Date(parseInt(time_added, 0) * 1000).toISOString();

    if (first) {
      query = SQL`INSERT INTO pocket (title, link, content, word_count, date_updated) VALUES (${resolved_title}, ${resolved_url}, ${excerpt}, ${word_count}, ${date_updated})`;
    } else {
      const q = SQL`,(${resolved_title}, ${resolved_url}, ${excerpt}, ${word_count}, ${date_updated})`;
      try {
        query = query.append(q);
      } catch (error) {
        console.error('Failed to build query');
        console.error(JSON.stringify(q));
        console.error(error);
      }
    }
  }

  try {
    await db.runQuery(query);
  } catch (error) {
    console.error('Failed to run query');
    console.error(JSON.stringify(query));
    console.error(error);
  }
  return;
}

(async function main() {
  try {
    console.log('Starting update script');
    console.log('Creating auth file from env');
    createAuthFile();
    console.log('Starting to scrape Pocket');
    await runPythonScript();
    const result = fs.readFileSync(`${DIR}/output.json`);
    console.log('Finished scraping Pocket');
    await db.runQuery(SQL`DELETE FROM pocket`);
    await insertRecords(result, db);
    fs.unlinkSync(`${DIR}/output.json`);
    console.log('Finished update script');
    process.exit(0);
  } catch (err) {
    console.error(err);
    console.log('Ended on critical error');
    process.exit(1);
  }
})();
