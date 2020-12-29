const { runGetQuery } = require('./db');

const transformArticle = ({ id, title, url, date, tags }) => ({
  id,
  title,
  url,
  date_updated: date,
  tags: tags.split(' '),
});

transformBook = ({ id, title, author, date }) => ({
  id,
  title,
  author,
  date_updated: date,
});

transformFilm = ({ id, title, year, date }) => ({
  id,
  name: title,
  year,
  date_updated: date,
});

async function getAllArticles() {
  return (await runGetQuery(`SELECT * FROM article WHERE tags NOT LIKE '%sex%' ORDER BY date DESC`)).map(transformArticle);
}

async function getFaveArticles() {
  return (await runGetQuery(`SELECT * FROM article WHERE fave = 1 ORDER BY date DESC`)).map(transformArticle);
}

async function getReading() {
  return (await runGetQuery(`SELECT * FROM book WHERE type = 'reading' ORDER BY date DESC`)).map(transformBook);
}

async function getRead() {
  return (await runGetQuery(`SELECT * FROM book WHERE type = 'read' ORDER BY date DESC`)).map(transformBook);
}

async function getToRead() {
  return (await runGetQuery(`SELECT * FROM book WHERE type = 'toread' ORDER BY date DESC`)).map(transformBook);
}

async function getWatched() {
  return (await runGetQuery(`SELECT * FROM film WHERE type = 'watched' ORDER BY date DESC`)).map(transformFilm);
}

async function getToWatch() {
  return (await runGetQuery(`SELECT * FROM film WHERE type = 'towatch' ORDER BY date DESC`)).map(transformFilm);
}

module.exports = {
  getAllArticles,
  getFaveArticles,
  getReading,
  getRead,
  getToRead,
  getWatched,
  getToWatch
};
