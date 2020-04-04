const { runQuery } = require('../db');

async function getPocketLinks() {
  const query = `
    SELECT title, link, content, word_count FROM pocket
    ORDER BY date_updated DESC;
  `;
  const result = await runQuery(query);
  return result;
}

module.exports = {getPocketLinks};
