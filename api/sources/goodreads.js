const {runQuery} = require('../db');

async function getReading({sort, limit, offset}) {
  const query = `
    SELECT title, author, image, date_updated FROM books
    WHERE status = 'reading'
    ORDER BY date_updated ${sort}
    LIMIT ${limit} OFFSET ${offset};
  `;
  const result = await runQuery(query);
  return result;
}

async function getRead({sort, limit, offset}) {
  const query = `
    SELECT title, author, image, date_updated FROM books
    WHERE status = 'read'
    ORDER BY date_updated ${sort}
    LIMIT ${limit} OFFSET ${offset};
  `;
  const result = await runQuery(query);
  return result;
}

async function getToRead({sort, limit, offset}) {
  const query = `
    SELECT title, author, image, date_updated FROM books
    WHERE status = 'toread'
    ORDER BY date_updated ${sort}
    LIMIT ${limit} OFFSET ${offset};
  `;
  const result = await runQuery(query);
  return result;
}

async function getCounts() {
  const query = `
    SELECT
      SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) AS read,
      SUM(CASE WHEN status = 'toread' THEN 1 ELSE 0 END) AS toread,
      SUM(CASE WHEN status = 'reading' THEN 1 ELSE 0 END) AS reading
    FROM books;
  `;
  const result = await runQuery(query);
  return result;
}

async function getSearch({sort, limit, offset, search}) {
  const query = `
    SELECT * FROM books WHERE
      LOWER(title) LIKE LOWER('%${search}%')
      OR
      LOWER(author) LIKE LOWER('%${search}%')
    ORDER BY date_updated ${sort}
    LIMIT ${limit} OFFSET ${offset};
  `;
  const result = await runQuery(query);
  return result;
}

module.exports = {getReading, getRead, getToRead, getCounts, getSearch};
