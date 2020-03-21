const { send } = require('micro');
const morgan = require('micro-morgan');
const cors = require('micro-cors')();
const goodreads = require('./sources/goodreads');
const letterboxd = require('./sources/letterboxd');
const feedbin = require('./sources/feedbin');

/**
 * ROUTER
 */
module.exports = cors(morgan('common')(async (req, res) => {
  if (['/', '/health'].includes(req.url)) {
    return {message: 'ok'};
  }

  if (req.url === '/books/reading') {
    const reading = await goodreads.getReading();
    return reading;
  }

  if (req.url === '/books/read') {
    const read = await goodreads.getRead();
    return read;
  }

  if (req.url === '/books/toread') {
    const toRead = await goodreads.getToRead();
    return toRead;
  }

  if (req.url === '/films/watched') {
    const watched = await letterboxd.getWatched();
    return watched;
  }

  if (req.url === '/films/towatch') {
    const watched = await letterboxd.getToWatch();
    return watched;
  }

  if (req.url === '/articles') {
    const watched = await feedbin.getLikes();
    return watched;
  }

  send(res, 404, { error: 'not found'});
}));
