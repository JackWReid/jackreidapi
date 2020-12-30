#!/usr/bin/env node

const Database = require('better-sqlite3');
const axios = require('axios');
const XmlParser = require('json-from-xml');
require('dotenv').config({ path: '/home/jack/server/scripts/.env' });
console.log('ENV': process.env);

const PINBOARD_URL = 'https://api.pinboard.in/v1/posts/all';

const transformForInsert = ({ href, time, description, tag, hash }) => ({
  url: href,
  date: time,
  title: description,
  tags: tag,
  hash,
  fave: tag.includes('fave') ? 1 : 0,
});

async function main() {
  console.log('Starting update script');

  try {
    console.log('Opening DB');
    const db = new Database('../db/media.db');

    console.log('Fetching all articles');
    const allResponse = await axios.get(PINBOARD_URL, {
      method: 'get',
      params: {
        auth_token: process.env.PINBOARD_TOKEN,
      }
    });

    console.log('Transforming article entries');
    const allJson = XmlParser.parse(allResponse.data);
    const transformedAll = allJson.post.map(transformForInsert);

    console.log('Blowing away old article data because I don\'t want to resolve conflicts');
    const deleteSql = db.prepare(`DELETE FROM article`);
    const deleteOp = deleteSql.run();
    console.log('Deleted', deleteOp);

    console.log('Inserting archive'); 
    for (let entry of transformedAll) {
      try {
        const sql = db.prepare(`INSERT INTO article(title, url, date, tags, hash, fave) VALUES (?, ?, ?, ?, ?, ?)`);
        const insert = sql.run(entry.title, entry.url, entry.date, entry.tags, entry.hash, entry.fave);
        console.log('Inserted', insert);
      } catch(error) {
        console.error('Insert error', error);
      }
    }
    db.close();
    console.log('Finished update script');
    process.exit(0);
  } catch (error) {
    console.error(error);
    console.log('Ended on critical error');
    process.exit(1);
  }
}

main();
