const { runQuery } = require('../db');

async function getLinks({ sort, limit, offset }) {
  const query = `
    SELECT title, link, content, word_count, date_updated FROM pocket
    ORDER BY date_updated ${sort}
    LIMIT ${limit} OFFSET ${offset};
  `;
  const result = await runQuery(query);
  return result;
}

async function getSearch({sort, limit, offset, search}) {
  const query = `
    SELECT title, link, content, word_count, date_updated FROM pocket
      LOWER(title) LIKE LOWER('%${search}%')
    ORDER BY date_updated ${sort}
    LIMIT ${limit} OFFSET ${offset};
  `;
  const result = await runQuery(query);
  return result;
}

module.exports = {getLinks, getSearch};
