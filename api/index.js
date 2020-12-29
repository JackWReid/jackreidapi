const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
 
require('dotenv').config({ path: '/home/jack/server/api/.env' });
const console = require('./log');
const { closeDb } = require('./db');

const models = require('./models');

const parseQuery = require('./parseQuery');

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'dev';

const app = express();

process.on('unhandledRejection', () => null);

app.use(cors());
app.use(morgan('short'));
app.use(helmet());
app.use(bodyParser.json());
app.use(parseQuery);

app.get('/', async function(req, res) {
  return res.send({message: 'ok'});
});

app.get('/health', async function(req, res) {
  return res.send({message: 'ok'});
});

app.get('/books/reading', async function(req, res) {
  try {
    const reading = await models.getReading(req.config);
    return res.send(reading);
  } catch (error) {
    console.error(error);
    return res.status(500).send({error: error.message});
  }
});

app.get('/books/toread', async function(req, res) {
  try {
    const toread = await models.getToRead(req.config);
    return res.send(toread);
  } catch (error) {
    console.error(error);
    return res.status(500).send({error: error.message});
  }
});

app.get('/books/read', async function(req, res) {
  try {
    const read = await models.getRead(req.config);
    return res.send(read);
  } catch (error) {
    console.error(error);
    return res.status(500).send({error: error.message});
  }
});

app.get('/films/watched', async function(req, res) {
  try {
    const watched = await models.getWatched(req.config);
    return res.send(watched);
  } catch (error) {
    console.error(error);
    return res.status(500).send({error: error.message});
  }
});

app.get('/films/towatch', async function(req, res) {
  try {
    const towatch = await models.getToWatch(req.config);
    return res.send(towatch);
  } catch (error) {
    console.error(error);
    return res.status(500).send({error: error.message});
  }
});

app.get('/articles', async function(req, res) {
  try {
    const articles = await models.getAllArticles(req.config);
    return res.send(articles);
  } catch (error) {
    console.error(error);
    return res.status(500).send({error: error.message});
  }
});

app.get('/articles/fave', async function(req, res) {
  try {
    const articles = await models.getFaveArticles();
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
  closeDb();
  process.exit(0);
}
