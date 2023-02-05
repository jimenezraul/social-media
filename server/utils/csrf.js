const crypto = require('crypto');

const csrf = {
  // create a _csrf token
  createCsrfToken: ({ res }) => {
    const token = crypto.randomBytes(64).toString('hex');
    res.cookie('x-csrf-token', token, { httpOnly: true });
    return token;
  },

  // verify that a _csrf token is equal to the one in the cookie
  verifyToken: ({ req, res }) => {
    const token = req.cookies._csrf;
    const headerToken = req.headers['x-csrf-token'];

    if (token !== headerToken) {
      return false;
    }

    return true;
  },
};

module.exports = csrf;
