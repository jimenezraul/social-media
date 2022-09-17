const {
  me,
  users,
  user,
  addUser,
  login,
  logout,
  verifyUser,
  refreshToken,
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
    addUser: addUser,
    verifyUser: verifyUser,
    login: login,
    logout: logout,
    refreshToken: refreshToken,
    addPost: addPost,
    addComment: addComment,
  },
};

module.exports = resolvers;
