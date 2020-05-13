const {Pool} = require('pg');
const console = require('./log');

const tr = (input, len) => input.length > len ? `${input.substring(0, len)}...` : input;

const pool = new Pool({
  user: process.env.PG_USERNAME,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: process.env.PG_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function runQuery(query) {
  const queryPreview = typeof query === 'string' ? tr(query, 1000) : tr(JSON.stringify(query), 1000);
  const start = Date.now();
  return pool.query(query).then(res => {
    const timing = Date.now() - start;
    console.info(`Query: (${timing}ms) ${queryPreview}`);
    return res.rows;
  });
}

module.exports = {runQuery};
