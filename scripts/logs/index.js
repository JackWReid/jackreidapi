const fs = require('fs');
const https = require('https');
const path = require('path');
const axios = require('axios');

const UPDATE_INTERVAL = 1000 * 60 * 5; // 5 minutes
const LOG_PATH = `/logs/server_log`;
const LOG_ENDPOINT = 'https://api.jackreid.xyz/log';

const ax = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

function readLogFile() {
  return fs
    .readFileSync(LOG_PATH, 'utf8')
    .split('\n')
    .filter(c => c.length > 0);
}

(async function main() {
  try {
    console.log('Running log upload script');
    const logLines = readLogFile();
    let ok = 0;
    let dup = 0;
    let hid = 0;
    let fail = 0;
    for (let i = 0; i < logLines.length; i++) {
      try {
        const body = JSON.parse(logLines[i]);
        if (JSON.parse(body.request).uri === '/log') {
          hid++;
          ok++;
        } else {
          const res = await ax.post(LOG_ENDPOINT, body);
          ok++;
        }
      } catch (error) {
        let usefulErr = error;
        if (error.response) {
          usefulErr = error.response.data.error;
        }

        if (usefulErr.includes('duplicate')) {
          dup++;
          ok++;
        } else {
          console.error(usefulErr);
          console.error('Inserting log failed');
          fail++;
        }
      }
    }

    console.log(`Done: [ok: ${ok} (${dup} dup, ${hid} hid), fail: ${fail}]`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
