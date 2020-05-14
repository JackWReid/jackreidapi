const sub = require('date-fns/sub');
const {runQuery} = require('../db');

async function postLog({
  ts,
  logger,
  msg,
  request,
  latency,
  size,
  status,
  resp_headers,
}) {
  const query = `
    INSERT INTO server_logs
    ("ts", "logger", "msg", "request", "latency", "size", "status", "resp_headers")
    VALUES(
      to_timestamp(${ts}),
      '${logger}',
      '${msg}',
      '${JSON.stringify(request)}',
      ${latency},
      ${size},
      ${status},
      '${JSON.stringify(resp_headers)}'
     )
  `;
  const result = runQuery(query);
  return result;
}

const cutoffDate = {
  hour: () => sub(new Date(), {hours: 1}).toISOString(),
  day: () => sub(new Date(), {days: 1}).toISOString(),
  week: () => sub(new Date(), {weeks: 1}).toISOString(),
  month: () => sub(new Date(), {months: 1}).toISOString(),
  year: () => sub(new Date(), {years: 1}).toISOString(),
};

async function topSiteHits(cutoff) {
  const since = cutoffDate[cutoff]();
  const query = `
  SELECT COUNT(id) AS hits, request->>'uri' AS url
  FROM server_logs
  WHERE request->>'host' = 'jackreid.xyz'
  AND status = 200
  AND ts > '${since}'
  GROUP BY url
  ORDER BY hits DESC
  LIMIT 50`;
  const result = runQuery(query);
  return result;
}

async function topSiteMisses(cutoff) {
  const since = cutoffDate[cutoff]();
  const query = `
  SELECT COUNT(id) AS hits, request->>'uri' AS url
  FROM server_logs
  WHERE request->>'host' = 'jackreid.xyz'
  AND status = 404
  AND ts > '${since}'
  GROUP BY url
  ORDER BY hits DESC
  LIMIT 50`;
  const result = runQuery(query);
  return result;
}

async function topApiHits(cutoff) {
  const since = cutoffDate[cutoff]();
  const query = `
  SELECT COUNT(id) AS hits, request->>'uri' AS url
  FROM server_logs
  WHERE request->>'host' = 'api.jackreid.xyz'
  AND status = 200
  AND ts > '${since}'
  GROUP BY url
  ORDER BY hits DESC
  LIMIT 50`;
  const result = runQuery(query);
  return result;
}

async function totalSiteHits(cutoff) {
  const since = cutoffDate[cutoff]();
  const query = `
  SELECT COUNT(id) AS hits
  FROM server_logs
  WHERE request->>'host' = 'jackreid.xyz'
  AND status = 200
  AND ts > '${since}'`;
  const result = runQuery(query);
  return result;
}

async function totalApiHits(cutoff) {
  const since = cutoffDate[cutoff]();
  const query = `
  SELECT COUNT(id) AS hits
  FROM server_logs
  WHERE request->>'host' = 'api.jackreid.xyz'
  AND status = 200
  AND ts > '${since}'`;
  const result = runQuery(query);
  return result;
}

async function getAnalyticsForCutoff(cuttoff) {
  const promises = [
    () => topSiteHits(cuttoff),
    () => topSiteMisses(cuttoff),
    () => topApiHits(cuttoff),
    () => totalSiteHits(cuttoff),
    () => totalApiHits(cuttoff),
  ];
  const res = await Promise.all(promises.map(p => p()));

  const labels = [
    'topSiteHits',
    'topSiteMisses',
    'topApiHits',
    'totalSiteHits',
    'totalApiHits',
  ];

  const obj = {};
  res.forEach((d, i) => obj[labels[i]] = d);
  return obj;
}

async function getAnalytics() {
  const cutoffs = Object.keys(cutoffDate);
  const promises = cutoffs.map(c => () => getAnalyticsForCutoff(c));
  const res = await Promise.all(promises.map(p => p()));
  console.log({res});
  const obj = {};
  res.forEach((d, i) => obj[cutoffs[i]] = d);
  return obj;
}

module.exports = {postLog, getAnalytics};
