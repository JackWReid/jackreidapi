const {Pool} = require('pg');

const pool = new Pool({
  user: process.env.PG_USERNAME,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: process.env.PG_PORT,
  ssl: true,
});

async function runQuery(query) {
  const start = Date.now();
  return pool.query(query)
    .then(res => {
      const timing = Date.now() - start;
      console.info(`[QUERY] (${timing}ms)`);
      return res.rows});
}

module.exports = {runQuery};
