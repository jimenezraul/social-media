const jwt = require("jsonwebtoken");
let expiration = "1h";

require("dotenv").config();

module.exports = {
  authMiddleware: function ({ req, res }) {
    let token = req.headers.authorization;
    
    // ["Bearer", "<tokenvalue>"]
    if (token) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
        maxAge: expiration,
      });
      
      req.user = data;
    } catch {
      console.log("Invalid token");
    }

    return req;
  },
  generateToken: function (user, secret) {
    let secretkey = process.env.ACCESS_TOKEN_SECRET;
    if (secret === "refresh") {
      secretkey = process.env.REFRESH_TOKEN_SECRET;
      expiration = "7d";
    }
    return jwt.sign(user, secretkey, { expiresIn: expiration });
  },
};
