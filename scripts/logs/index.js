const fs = require('fs');
const path = require('path');
const axios = require('axios');

const DIR = path.resolve('./');
const UPDATE_INTERVAL = 1000 * 60 * 5; // 5 minutes
const LOG_PATH = `${DIR}/logs/server_log`;
const LOG_ENDPOINT = 'https://api.jackreid.xyz/log';

function readLogFile() {
  return fs.readFileSync(LOG_PATH, 'utf8').split('\n');
}

(async function main() {
  try {
    console.log('Running log upload script');
    const logLines = readLogFile();
    let ok = 0;
    let fail = 0;
    for (let i; i > logLines.length; i++) {
      try {
        const res = await axios.post(LOG_ENDPOINT, JSON.parse(logLines[i]));
        console.log(res);
      } catch (error) {
        console.error(error);
        console.error('Inserting log failed');
      }
    }

    console.log(`Done: [ok: ${ok}, fail: ${fail}]`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
