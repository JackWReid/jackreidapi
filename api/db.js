const Database = require('better-sqlite3');
const console = require('./log');

const db = new Database('../db/media.db');

async function runGetQuery(query) {
  const sql = db.prepare(query);
  const start = Date.now();
  const result = sql.all();
  const timing = Date.now() - start;
  console.info(`Query: (${timing}ms) ${query}`);
  return result;
}

function closeDb() {
  return db.close();
}

module.exports = {runGetQuery, closeDb};
