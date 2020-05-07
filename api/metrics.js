const client = require('prom-client');

const reqCounter = new client.Counter({
  name: 'http_request_total',
  help: 'Total HTTP requests through the server',
  labels: ['method', 'path'],
});

const lookupCounter = new client.Counter({
  name: 'db_lookup_total',
  help: 'Total lookups from the server',
  labels: ['type'],
});

const lookupLength = new client.Counter({
  name: 'db_lookup_result_length',
  help: 'Length of responses from the server',
  labels: ['type'],
});

function reqMetricMiddleware(req, res, next) {
  reqCounter
    .labels({
      method: req.method,
      path: req.route.path,
    })
    .inc();

  next();
}

module.exports = {reqMetricMiddleware, lookupCounter, lookupLength};
