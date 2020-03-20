const { getDb } = require('../db');

async function getToWatch() {
  const db = await getDb();
  const query = `
    SELECT name, year, link, date_updated FROM films
    WHERE status = 'towatch'
    ORDER BY date_updated DESC;
  `;
  const result = await db.all(query);
  await db.close();
  return result;
}

async function getWatched() {
  const db = await getDb();
  const query = `
    SELECT name, year, link, date_updated FROM films
    WHERE status = 'watched'
    ORDER BY date_updated DESC;
  `;
  const result = await db.all(query);
  await db.close();
  return result;
}

module.exports = {getToWatch, getWatched};
