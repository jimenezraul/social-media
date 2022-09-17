const { me, user, users } = require("./user");
const { addUser } = require("./register");
const { login } = require("./login");
const { logout } = require("./logout");
const { verifyUser } = require("./accountVerification");
const { refreshToken } = require("./refreshToken");

module.exports = {
  me: me,
  user: user,
  users: users,
  addUser: addUser,
  login: login,
  logout: logout,
  verifyUser: verifyUser,
  refreshToken: refreshToken,
};
