#!/usr/bin/env node

const micro = require('micro');
const app = require('./index.js');

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'dev';

const server = micro(app);
server.listen(PORT);
console.log(`API listening localhost:${PORT} [${ENV}]`);
