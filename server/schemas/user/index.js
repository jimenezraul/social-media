const { me, user, users } = require("./user");
const { register } = require("./register");
const { login } = require("./login");
const { logout } = require("./logout");
const { verifyUser } = require("./accountVerification");
const { refreshToken } = require("./refreshToken");
const { friendRequest, acceptFriendRequest } = require("./friendRequest");

module.exports = {
  me: me,
  user: user,
  users: users,
  register: register,
  login: login,
  logout: logout,
  verifyUser: verifyUser,
  refreshToken: refreshToken,
  friendRequest: friendRequest,
  acceptFriendRequest: acceptFriendRequest,
};
