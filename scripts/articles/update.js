#!/usr/bin/env node

const SQL = require('sql-template-strings');
const Parser = require('rss-parser');
const parser = new Parser();

const db = require('./db');
const console = require('./log');

const FEEDBIN_FEED_URL =
  'https://feedbin.com/starred/4265024820b3b2381c0cf39078b571b4.xml';

(async () => {
  console.log('Starting update script');
  let feed = await parser.parseURL(FEEDBIN_FEED_URL);

  const insertItems = feed.items.map(
    ({title, content, contentSnippet, creator, link, isoDate}) => ({
      title,
      description: contentSnippet,
      content,
      author: creator,
      link,
      date_created: isoDate,
    }),
  );

  await db.runQuery(SQL`DELETE FROM likes`);
  let query;
  for (let i = 0; i < insertItems.length; i++) {
    const first = i === 0;
    const last = i === insertItems.length;
    const {
      title,
      description,
      content,
      author,
      link,
      date_created,
    } = insertItems[i];

    if (first) {
      query = SQL`INSERT INTO likes (title, description, content, author, link, date_updated) VALUES (${title}, ${description}, ${content}, ${author}, ${link}, ${date_created})`;
    } else {
      const q = SQL`,(${title}, ${description}, ${content}, ${author}, ${link}, ${date_created})`;
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
    console.log('Finished update script');
  } catch (error) {
    if (error.code === '23505') {
      console.log(`Didn't insert duplicate "${insertItems[0].title}"`);
    } else {
      console.error('Failed to run query');
      console.error(JSON.stringify(query));
      console.error(error);
      console.log('Ended on critical error');
    }
  }
  return;
})();
