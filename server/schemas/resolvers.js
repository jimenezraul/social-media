const { me, users, user, addUser, login, verifyUser } = require("./user");
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
    addPost: addPost,
    addComment: addComment
  },
};

module.exports = resolvers;
