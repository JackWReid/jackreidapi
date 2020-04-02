const {runQuery} = require('../db');

async function getLikes() {
  const query = `
    SELECT title, description, link, author, date_updated FROM likes
    ORDER BY date_updated DESC;
  `;
  const result = await runQuery(query);
  return result;
}

module.exports = {getLikes};
