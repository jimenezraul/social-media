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
const {
  post,
  posts,
  addPost,
  addComment,
  removeComment,
  likes,
  feed,
} = require("./posts");

const resolvers = {
  Query: {
    me: me,
    users: users,
    user: user,
    post: post,
    posts: posts,
    feed: feed,
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
    addComment: addComment,
    removeComment: removeComment,
    likes: likes,
  },
};

module.exports = resolvers;
