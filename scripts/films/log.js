const proc = process.env.APP;

const cLog = string => {
  const dt = new Date().toISOString();
  console.log(`${dt} | [${proc}] ${string}`);
};

const cInfo = string => {
  const dt = new Date().toISOString();
  console.info(`${dt} | [${proc}] [info] ${string}`);
};

const cError = string => {
  const dt = new Date().toISOString();
  console.error(`${dt} | [${proc}] [error] ${string}`);
};

module.exports = {
  log: cLog,
  info: cInfo,
  error: cError,
};
