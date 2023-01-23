const allowedOrigins = require('../config/allowedOrigins');
const { Auth } = require('@jimenezraul/auth');

const authMiddleware = new Auth('15m', '7d', allowedOrigins);

module.exports = authMiddleware;
