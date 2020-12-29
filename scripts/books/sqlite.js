const sqlite3 = require('sqlite3').verbose();

const bookData = {};
bookData.read = require('./data/read.json');
bookData.reading = require('./data/reading.json');
bookData.toread = require('./data/toread.json');
filmData = require('./data/films.json').items;

let db = new sqlite3.Database('../../db/media.db', err => {
  if (err) {
    return console.error('Failed to open DB', err);
  }

  console.log('Opened DB');
});

for (filmEntry of filmData) {
  const title = filmEntry.title.split(',')[0];
  
  //const sql = `INSERT INTO film(title, date, type) VALUES(?, ?, ?, ?)`;
  //values = [ 'watched'];
  //db.run(sql, values, err => {
  //if (err) {
  //  console.error(err.message);
  //  console.log(sql);
  //}
  //console.log('Successful insert');
  //});
}

db.close((err) => {
  if (err) {
    return console.error(err.message);
  }

  console.log('Closed DB');
});

