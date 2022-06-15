const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const mongoLink = 'mongodb://localhost:27017/moviesdb';
const secretKey = 'super-secret-key';

module.exports = {
  limiter,
  mongoLink,
  secretKey,
};
