const {Pool} = require('pg');
const promClient = require('prom-client');
const console = require('./log');

const reqCounter = new promClient.Counter({
  name: 'db_upstream_request_total',
  help: 'Total database calls sent from the API',
});

const reqTiming = new promClient.Gauge({
  name: 'db_upstream_timing',
  help: 'Timing for upstream database calls sent from API',
});

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
  reqCounter.inc();
  reqTiming.setToCurrentTime();
  const endTimer = reqTiming.startTimer();
  return pool.query(query).then(res => {
    const timing = Date.now() - start;
    console.info(`Query: (${timing}ms) ${queryPreview}`);
    endTimer();
    return res.rows;
  });
}

module.exports = {runQuery};
