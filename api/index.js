const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const goodreads = require('./sources/goodreads');
const letterboxd = require('./sources/letterboxd');
const feedbin = require('./sources/feedbin');

const parseQuery = require('./parseQuery');

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'dev';

const app = express();

app.use(cors());
app.use(morgan());
app.use(helmet());
app.use(parseQuery);

app.get('/', async function(req, res) {
  return res.send({message: 'ok'});
});

app.get('/health', async function(req, res) {
  return res.send({message: 'ok'});
});

app.get('/books/reading', async function(req, res) {
  const reading = await goodreads.getReading(req.config);
  return res.send(reading);
});

app.get('/books/toread', async function(req, res) {
  const toread = await goodreads.getToRead(req.config);
  return res.send(toread);
});

app.get('/books/read', async function(req, res) {
  const read = await goodreads.getRead(req.config);
  return res.send(read);
});

app.get('/books/search/:search', async function(req, res) {
  const counts = await goodreads.getSearch({
    ...req.config,
    search: req.params.search,
  });
  return res.send(counts);
});

app.get('/books/count', async function(req, res) {
  const counts = await goodreads.getCounts();
  return res.send(counts);
});

app.get('/films/watched', async function(req, res) {
  const watched = await letterboxd.getWatched(req.config);
  return res.send(watched);
});

app.get('/films/towatch', async function(req, res) {
  const towatch = await letterboxd.getToWatch(req.config);
  return res.send(towatch);
});

app.get('/films/count', async function(req, res) {
  const counts = await letterboxd.getCounts();
  return res.send(counts);
});

app.get('/films/search/:search', async function(req, res) {
  const counts = await letterboxd.getSearch({
    ...req.config,
    search: req.params.search,
  });
  return res.send(counts);
});

app.get('/articles', async function(req, res) {
  const articles = await feedbin.getLikes(req.config);
  return res.send(articles);
});

app.get('*', async function(req, res) {
  return res.status(404).send({error: 'not found'});
});

app.listen(PORT);
console.log(`API listening localhost:${PORT} [${ENV}]`);
