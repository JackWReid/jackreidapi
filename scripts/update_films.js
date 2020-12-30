#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const csvToJson = require('csvtojson');

const Database = require('better-sqlite3');

const DIR = path.resolve('./');

async function insertRecords(records, db) {
  for (let entry of records) {
    try {
      const sql = db.prepare(`INSERT INTO film(title, year, type, rating, date) VALUES (?, ?, ?, ?, ?)`);
      const insert = sql.run(entry.title, entry.year, entry.status, entry.rating, entry.date);
      console.log('Inserted', insert);
    } catch(error) {
      console.error('Insert error', error);
    }
  }
}

function transformFilms(filmArray, status) {
  return filmArray.map(film => ({
    date: film['Watched Date'] || film.Date,
    title: film.Name,
    year: film.Year || null,
    rating: film.Rating || null,
    status,
  })).filter(film => (
    film.title && film.year && film.status
  ));
}

async function fetchFilms() {
  const diaryCsv = fs.readFileSync('./letterboxd/diary.csv', 'utf-8');
  const watchlistCsv = fs.readFileSync('./letterboxd/watchlist.csv', 'utf-8');

  const trans = await csvToJson().fromString(diaryCsv);
  console.log(trans);
  console.log('Converting CSV to JSON');
  const watched = transformFilms(
    await csvToJson().fromString(diaryCsv),
    'watched',
  );
  const towatch = transformFilms(
    await csvToJson().fromString(watchlistCsv),
    'towatch',
  );
  return {watched, towatch};
}

(async function main() {
  try {
    console.log('Starting update script');

    console.log('Opening DB');
    const db = new Database('/Users/jackreid/db/media.db');

    const {watched, towatch} = await fetchFilms();
    const merged = [...watched, ...towatch];
    const delStatement = await db.prepare(`DELETE FROM film`);
    await delStatement.run();
    const res = await insertRecords(merged, db);
    db.close();
    console.log('Finished update script');
    process.exit(0);
  } catch (error) {
    console.error(error);
    console.log('Ended on critical error');
    process.exit(1);
  }
})();

module.exports = {fetchFilms};
