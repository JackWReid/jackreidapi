#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {spawn} = require('child_process');
const sqlite = require('sqlite');
const SQL = require('sql-template-strings');

const db = require('./db');
const console = require('./log');

const DIR = path.resolve('./');

function createAuthFile() {
  const auth = {
    goodreads_personal_token: process.env.GOODREADS_PERSONAL_TOKEN,
    goodreads_secret: process.env.GOODREADS_SECRET,
    goodreads_user_id: '54047855',
  };

  fs.writeFileSync(`${DIR}/auth.json`, JSON.stringify(auth));
}

async function runPythonScript() {
  return new Promise((resolve, reject) => {
    const process = spawn('goodreads-to-sqlite', [
      'books',
      `${DIR}/books.db`,
      '--auth=./auth.json',
    ]);

    process.on('close', code => {
      if (code !== 0) {
        reject(`goodreads-to-sqlite failed, code ${code}`);
      }

      resolve();
    });
  });
}

async function queryTmpDb(shelf) {
  const db = await sqlite.open(`${DIR}/books.db`);
  const query = `
    SELECT shelves.name, books.title, books.image_url, authors.name, reviews.date_updated
    FROM reviews_shelves
    INNER JOIN shelves ON shelves.id = shelves_id
    INNER JOIN reviews ON reviews.id = reviews_id
    INNER JOIN books ON reviews.book_id = books.id
    INNER JOIN authors_books ON authors_books.books_id = books.id
    INNER JOIN authors ON authors_books.authors_id = authors.id
    WHERE shelves.name = '${shelf}'
    ORDER BY reviews.date_updated DESC
    LIMIT 5000;
  `;
  const result = await db.all(query);
  await db.close();
  return result;
}
async function insertRecords(records, status, db) {
  let query;
  for (let i = 0; i < records.length; i++) {
    const first = i === 0;
    const last = i === records.length;
    const {title, name, image_url, date_updated} = records[i];

    if (first) {
      query = SQL`INSERT INTO books (title, author, image, status, date_updated) VALUES (${title}, ${name}, ${image_url}, ${status}, ${date_updated})`;
    } else {
      const q = SQL`,(${title}, ${name}, ${image_url}, ${status}, ${date_updated})`;
      try {
        query = query.append(q);
      } catch (error) {
        console.error('Failed to build query');
        console.error(JSON.stringify(q));
        console.error(error);
      }
    }
  }

  try {
    await db.runQuery(query);
  } catch (error) {
    console.error('Failed to run query');
    console.error(JSON.stringify(query));
    console.error(error);
  }
  return;
}

(async function main() {
  try {
    console.log('Starting update script');
    console.log('Creating auth file from env');
    createAuthFile();
    console.log('Starting to scrape Goodreads');
    await runPythonScript();
    console.log('Finished scraping Goodreads');
    const reading = await queryTmpDb('currently-reading');
    const toread = await queryTmpDb('to-read');
    const read = await queryTmpDb('read');
    await db.runQuery(SQL`DELETE FROM books`);
    await insertRecords(reading, 'reading', db);
    await insertRecords(toread, 'toread', db);
    await insertRecords(read, 'read', db);
    fs.unlinkSync(`${DIR}/books.db`);
    console.log('Finished update script');
    process.exit(0);
  } catch (err) {
    console.error(err);
    console.log('Ended on critical error');
    process.exit(1);
  }
})();
