const defaults = {
  sort: 'DESC',
  limit: 500,
  offset: 0,
};

function parseQuery(req, res, next) {
  const config = {
    sort: req.query.sort || defaults.sort,
    limit: req.query.limit || defaults.limit,
    offset: req.query.offset || defaults.offset,
  };

  req.config = config;

  next();
}

module.exports = parseQuery;
