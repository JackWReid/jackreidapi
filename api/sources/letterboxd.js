const {runQuery} = require('../db');
const {lookupCounter, lookupLength} = require('../metrics');

async function getToWatch({sort, limit, offset}) {
  const query = `
    SELECT name, year, link, date_updated FROM films
    WHERE status = 'towatch'
    ORDER BY date_updated ${sort}
    LIMIT ${limit} OFFSET ${offset};
  `;
  const result = await runQuery(query);
  lookupCounter.labels({type: 'films-towatch'}).incr();
  lookupLength.labels({type: 'films-towatch'}).set(result.length);
  return result;
}

async function getWatched({sort, limit, offset}) {
  const query = `
    SELECT name, year, link, date_updated FROM films
    WHERE status = 'watched'
    ORDER BY date_updated ${sort}
    LIMIT ${limit} OFFSET ${offset};
  `;
  const result = await runQuery(query);
  lookupCounter.labels({type: 'films-watched'}).incr();
  lookupLength.labels({type: 'films-watched'}).set(result.length);
  return result;
}

async function getCounts() {
  const query = `
    SELECT
      SUM(CASE WHEN status = 'watched' THEN 1 ELSE 0 END) AS watched,
      SUM(CASE WHEN status = 'towatch' THEN 1 ELSE 0 END) AS towatch
    FROM films;
  `;
  const result = await runQuery(query);
  return result;
}

async function getSearch({sort, limit, offset, search}) {
  const query = `
    SELECT * FROM films WHERE
      LOWER(name) LIKE LOWER('%${search}%')
    ORDER BY date_updated ${sort}
    LIMIT ${limit} OFFSET ${offset};
  `;
  const result = await runQuery(query);
  return result;
}

module.exports = {getToWatch, getWatched, getCounts, getSearch};
