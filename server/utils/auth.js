const jwt = require('jsonwebtoken');
const allowedOrigins = require('../config/allowedOrigins');
let expiration = '1d';

require('dotenv').config();

module.exports = {
  authMiddleware: function ({ req }) {
    let token = req.headers.authorization || req.headers.Authorization;

    if (!token) {
      return req;
    }

    token = token.split(' ').pop().trim();

    const data = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      {
        maxAge: expiration,
      },
      (err, decoded) => {
        if (err) {
          return req;
        }
        req.user = decoded.user;
        return req;
      }
    );

    return req;
  },
  generateToken: function (user, type) {
    let secretkey = process.env.ACCESS_TOKEN_SECRET;
    if (type === 'refresh') {
      secretkey = process.env.REFRESH_TOKEN_SECRET;
      expiration = '7d';
    }
    return jwt.sign(user, secretkey, { expiresIn: expiration });
  },
  credentials: (req, res, next) => {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Credentials', true);
    }

    next();
  },
  validToken: (refreshToken) => {
    return jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return false;
        }
        return true;
      }
    );
  },
};
