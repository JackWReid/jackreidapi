const client = require('prom-client');

const reqCounter = new client.Counter({
  name: 'http_request_total',
  help: 'Total HTTP requests through the server',
  labelNames: ['method', 'path'],
});

const lookupCounter = new client.Counter({
  name: 'db_lookup_total',
  help: 'Total lookups from the server',
  labelNames: ['type'],
});

const lookupLength = new client.Gauge({
  name: 'db_lookup_result_length',
  help: 'Length of responses from the server',
  labelNames: ['type'],
});

function reqMetricMiddleware(req, res, next) {
  reqCounter.labels(req.method, req.url).inc();

  next();
}

module.exports = {reqMetricMiddleware, lookupCounter, lookupLength};
