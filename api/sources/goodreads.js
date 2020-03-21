const {runQuery} = require('../db');

const shelves = {
  READING: 'currently-reading',
  TOREAD: 'to-read',
  READ: 'read',
};

async function getReading() {
  const query = `
    SELECT title, author, image, date_updated FROM books
    WHERE status = 'reading'
    ORDER BY date_updated DESC;
  `;
  const result = await runQuery(query);
  return result;
}

async function getRead() {
  const query = `
    SELECT title, author, image, date_updated FROM books
    WHERE status = 'read'
    ORDER BY date_updated DESC;
  `;
  const result = await runQuery(query);
  return result;
}

async function getToRead() {
  const query = `
    SELECT title, author, image, date_updated FROM books
    WHERE status = 'toread'
    ORDER BY date_updated DESC;
  `;
  const result = await runQuery(query);
  return result;
}

module.exports = {getReading, getRead, getToRead};
