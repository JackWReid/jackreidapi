#!/usr/bin/env node

const SQL = require('sql-template-strings');
const axios = require('axios');
const xmlConvert = require('xml-js');

const db = require('./db');
const console = require('./log');

const BASE_URL = 'https://www.goodreads.com/';

const singleOrMap = (val, fn) => val.length ? val.map(fn) : [val].map(fn);
const singleOrFirst = (val, fn) => singleOrMap(val, fn)[0];

async function fetchBooks() {
  const url = `${BASE_URL}review/list/${process.env.GOODREADS_USER_ID}.xml`;
  const params = {
    key: process.env.GOODREADS_PERSONAL_TOKEN,
    v: '2',
    per_page: '200',
    sort: 'date_updated',
    page: 0,
  };
  
  let end = -1;
  let total = 0;
  const books = [];

  while (end < total) {
    params.page++;

    try {
      const response = await axios.get(url, {params});
      const data = xmlConvert.xml2js(response.data, {
        compact: true,
        trim: true,
        sanitize: true,
        ignoreDeclaration: true,
        ignoreComment: true,
        ignoreCdata: true,
        ignoreDoctype: true,
      });

      end = parseInt(data.GoodreadsResponse.reviews._attributes.end, 10);
      total = parseInt(data.GoodreadsResponse.reviews._attributes.total, 10);

      for (review of data.GoodreadsResponse.reviews.review) {
        const book = {
          id: review.book.id._text,
          isbn: review.book.isbn._text,
          title: review.book.title._text,
          title_without_series: review.book.title_without_series._text,
          image: review.book.image_url._text,
          description: review.book.description._text,
          author: singleOrFirst(review.book.authors.author, a => a.name._text),
          rating: review.rating._text,
          status: singleOrFirst(review.shelves.shelf, s => s._attributes.name),
          started_at: review.started_at._text,
          date_added: review.date_added._text,
          date_update: review.date_updated._text,
          read_count: review.read_count._text,
        };

        books.push(book);
      }

      console.log('Done fetching');
      return books;
    } catch (error) {
      console.log(`Error: ending early at ${end} of ${total}`);
      console.error(error);
      return books;
    }
  }
}

async function insertRecords(records, db) {
  let query;
  for (let i = 0; i < records.length; i++) {
    const first = i === 0;
    const last = i === records.length;
    const {title, name, image_url, date_updated, goodreads_id, started_at, date_added, read_count, status} = records[i];

    if (first) {
      query = SQL`INSERT INTO books (title, author, image, status, date_updated, goodreads_id, started_at, date_added, read_count) VALUES (${title}, ${name}, ${image_url}, ${status}, ${date_updated}, ${goodreads_id}, ${started_at}, ${date_added}, ${read_count})`;
    } else {
      const q = SQL`,(${title}, ${name}, ${image_url}, ${status}, ${date_updated}, ${goodreads_id}, ${started_at}, ${date_added}, ${read_count})`;
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
    console.log('Starting to scrape Goodreads');
    const books = await fetchBooks();
    console.log('Finished scraping Goodreads');
    await db.runQuery(SQL`DELETE FROM books`);
    await insertRecords(books, db);
    console.log('Finished update script');
    process.exit(0);
  } catch (err) {
    console.error(err);
    console.log('Ended on critical error');
    process.exit(1);
  }
})();
