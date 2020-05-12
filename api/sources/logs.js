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
  console.log(query);
  const result = runQuery(query);
  return result;
}

module.exports = {postLog};
