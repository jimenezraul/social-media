const { me, user, users } = require("./user");
const { register } = require("./register");
const { login } = require("./login");
const { logout } = require("./logout");
const { verifyUser } = require("./accountVerification");
const { refreshToken } = require("./refreshToken");
const { friendRequest, acceptFriendRequest, removeFriend } = require("./friendRequest");
const { googleLogin } = require("./googleLogin");

const userResolvers = {
  userQuery: {
    me: me,
    user: user,
    users: users,
  },
  userMutation: {
    register: register,
    login: login,
    logout: logout,
    verifyUser: verifyUser,
    refreshToken: refreshToken,
    friendRequest: friendRequest,
    acceptFriendRequest: acceptFriendRequest,
    googleLogin: googleLogin,
    removeFriend: removeFriend,
  },
};

module.exports = userResolvers;
