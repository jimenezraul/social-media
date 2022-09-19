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
  updatePost,
  deletePost,
  addComment,
  deleteComment,
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
    updatePost: updatePost,
    deletePost: deletePost,
    friendRequest: friendRequest,
    acceptFriendRequest: acceptFriendRequest,
    addComment: addComment,
    deleteComment: deleteComment,
    likes: likes,
  },
};

module.exports = resolvers;
