const {runQuery} = require('../db');

async function getLikes({ sort, limit, offset }) {
  const query = `
    SELECT title, description, link, author, date_updated FROM likes
    ORDER BY date_updated ${sort}
    LIMIT ${limit} OFFSET ${offset};
  `;
  const result = await runQuery(query);
  return result;
}

module.exports = {getLikes};
