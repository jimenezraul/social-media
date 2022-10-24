const { me, user, users } = require('./user');
const { register } = require('./register');
const { login } = require('./login');
const { logout } = require('./logout');
const { verifyUser } = require('./accountVerification');
const { refreshToken } = require('./refreshToken');
const { resetPassword } = require('./resetPassword');
const { forgotPassword } = require('./forgotPassword');
const { resendVerificationEmail } = require('./resendVerificationEmail');
const {
  friendRequest,
  acceptFriendRequest,
  removeFriend,
  newFriendRequestSubscription,
} = require('./friendRequest');
const { googleLogin } = require('./googleLogin');

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
    resetPassword: resetPassword,
    forgotPassword: forgotPassword,
    resendVerificationEmail: resendVerificationEmail,
  },
  userSubscription: {
    newFriendRequestSubscription: newFriendRequestSubscription,
  },
};

module.exports = userResolvers;
