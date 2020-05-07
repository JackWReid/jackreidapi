const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const promBundle = require('express-prom-bundle');
const promClient = require('prom-client');

const console = require('./log');

const goodreads = require('./sources/goodreads');
const letterboxd = require('./sources/letterboxd');
const feedbin = require('./sources/feedbin');
const pocket = require('./sources/pocket');

const parseQuery = require('./parseQuery');

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'dev';

const app = express();
promClient.collectDefaultMetrics();
const metricsMiddleware = promBundle({includeMethod: true, includePath: true});

process.on('unhandledRejection', () => null);

app.use(metricsMiddleware);
app.use(ownMetrics);
app.use(cors());
app.use(morgan('short'));
app.use(helmet());
app.use(parseQuery);

app.get('/', async function(req, res) {
  return res.send({message: 'ok'});
});

app.get('/health', async function(req, res) {
  return res.send({message: 'ok'});
});

app.get('/books/reading', async function(req, res) {
  try {
    const reading = await goodreads.getReading(req.config);
    return res.send(reading);
  } catch (error) {
    console.error(error);
    return res.status(500).send({error: error.message});
  }
});

app.get('/books/toread', async function(req, res) {
  try {
    const toread = await goodreads.getToRead(req.config);
    return res.send(toread);
  } catch (error) {
    console.error(error);
    return res.status(500).send({error: error.message});
  }
});

app.get('/books/read', async function(req, res) {
  try {
    const read = await goodreads.getRead(req.config);
    return res.send(read);
  } catch (error) {
    console.error(error);
    return res.status(500).send({error: error.message});
  }
});

app.get('/books/search/:search', async function(req, res) {
  try {
    const counts = await goodreads.getSearch({
      ...req.config,
      search: req.params.search,
    });
    return res.send(counts);
  } catch (error) {
    console.error(error);
    return res.status(500).send({error: error.message});
  }
});

app.get('/books/count', async function(req, res) {
  try {
    const counts = await goodreads.getCounts();
    return res.send(counts);
  } catch (error) {
    console.error(error);
    return res.status(500).send({error: error.message});
  }
});

app.get('/films/watched', async function(req, res) {
  try {
    const watched = await letterboxd.getWatched(req.config);
    return res.send(watched);
  } catch (error) {
    console.error(error);
    return res.status(500).send({error: error.message});
  }
});

app.get('/films/towatch', async function(req, res) {
  try {
    const towatch = await letterboxd.getToWatch(req.config);
    return res.send(towatch);
  } catch (error) {
    console.error(error);
    return res.status(500).send({error: error.message});
  }
});

app.get('/films/count', async function(req, res) {
  try {
    const counts = await letterboxd.getCounts();
    return res.send(counts);
  } catch (error) {
    console.error(error);
    return res.status(500).send({error: error.message});
  }
});

app.get('/films/search/:search', async function(req, res) {
  try {
    const films = await letterboxd.getSearch({
      ...req.config,
      search: req.params.search,
    });
    return res.send(films);
  } catch (error) {
    console.error(error);
    return res.status(500).send({error: error.message});
  }
});

app.get('/pocket', async function(req, res) {
  try {
    const links = await pocket.getLinks(req.config);
    return res.send(links);
  } catch (error) {
    console.error(error);
    return res.status(500).send({error: error.message});
  }
});

app.get('/pocket/search/:search', async function(req, res) {
  try {
    const links = await pocket.getSearch({
      ...req.config,
      search: req.params.search,
    });
    return res.send(links);
  } catch (error) {
    console.error(error);
    return res.status(500).send({error: error.message});
  }
});

app.get('/articles', async function(req, res) {
  try {
    const articles = await feedbin.getLikes(req.config);
    return res.send(articles);
  } catch (error) {
    console.error(error);
    return res.status(500).send({error: error.message});
  }
});

app.get('*', async function(req, res) {
  return res.status(404).send({error: 'not found'});
});

app.listen(PORT);
console.log(`API listening localhost:${PORT}`);

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown() {
  console.log('Received kill signal, shutting down gracefully');
  server.close(() => {
    console.log('Closed out remaining connections');
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      'Could not close connections in time, forcefully shutting down',
    );
    process.exit(1);
  }, 10000);

  connections.forEach(curr => curr.end());
  setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
}
