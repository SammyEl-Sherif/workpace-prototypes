if (process.env.NODE_ENV === 'production') {
  module.exports = require('./production/lib.cjs');
} else {
  module.exports = require('./development/lib.cjs');
}
