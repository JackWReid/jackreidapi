const { runQuery } = require('../db');

async function getLinks({ sort, limit, offset }) {
  const query = `
    SELECT * FROM pocket
    ORDER BY date_updated ${sort}
    LIMIT ${limit} OFFSET ${offset};
  `;
  const result = await runQuery(query);
  return result;
}

async function getSearch({sort, limit, offset, search}) {
  const query = `
    SELECT * FROM pocket WHERE
      LOWER(title) LIKE LOWER('%${search}%')
    ORDER BY date_updated ${sort}
    LIMIT ${limit} OFFSET ${offset};
  `;
  const result = await runQuery(query);
  return result;
}

module.exports = {getLinks, getSearch};
