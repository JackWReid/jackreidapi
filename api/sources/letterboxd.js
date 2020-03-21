const {runQuery} = require('../db');

async function getToWatch() {
  const query = `
    SELECT name, year, link, date_updated FROM films
    WHERE status = 'towatch'
    ORDER BY date_updated DESC;
  `;
  const result = await runQuery(query);
  return result;
}

async function getWatched() {
  const query = `
    SELECT name, year, link, date_updated FROM films
    WHERE status = 'watched'
    ORDER BY date_updated DESC;
  `;
  const result = await runQuery(query);
  return result;
}

module.exports = {getToWatch, getWatched};
