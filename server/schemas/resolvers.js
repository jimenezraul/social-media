const {
  me,
  users,
  user,
  register,
  login,
  logout,
  verifyUser,
  refreshToken,
  friendRequest,
  acceptFriendRequest,
} = require("./user");
const { post, posts, addPost, addComment } = require("./posts");

const resolvers = {
  Query: {
    me: me,
    users: users,
    user: user,
    post: post,
    posts: posts,
  },
  Mutation: {
    register: register,
    verifyUser: verifyUser,
    login: login,
    logout: logout,
    refreshToken: refreshToken,
    addPost: addPost,
    addComment: addComment,
    friendRequest: friendRequest,
    acceptFriendRequest: acceptFriendRequest,
  },
};

module.exports = resolvers;
