const {runQuery} = require('../db');
const {lookupCounter, lookupLength} = require('../metrics');

async function getLikes({sort, limit, offset}) {
  const query = `
    SELECT title, description, link, author, date_updated FROM likes
    ORDER BY date_updated ${sort}
    LIMIT ${limit} OFFSET ${offset};
  `;
  const result = await runQuery(query);
  lookupCounter.labels('likes').inc();
  lookupLength.labels('likes').set(result.length);
  return result;
}

module.exports = {getLikes};
